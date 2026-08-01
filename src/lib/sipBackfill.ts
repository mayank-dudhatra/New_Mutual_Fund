// src/lib/sipBackfill.ts
import clientPromise from "@/lib/mongodb";
import { VirtualSip, SipTransaction } from "@/models/VirtualPortfolio";
import { getScheme } from "@/lib/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

interface NavEntry {
  date: dayjs.Dayjs;
  nav: number;
}

export interface SipBackfillResult {
  processed: number;
  completedInstallments: number;
  totalInvested: number;
  totalUnits: number;
  nextSipDate: string;
  status: VirtualSip["status"];
}

/**
 * Fetches the full NAV history for a scheme (newest-to-oldest as returned by the provider).
 */
async function fetchNavHistory(schemeCode: number): Promise<NavEntry[] | null> {
  try {
    const scheme = await getScheme(String(schemeCode));
    const data = scheme?.data;
    if (!Array.isArray(data) || data.length === 0) return null;
    return data
      .map((entry: any) => ({
        date: dayjs(entry.date, "DD-MM-YYYY"),
        nav: parseFloat(entry.nav),
      }))
      .filter((entry: NavEntry) => entry.date.isValid() && entry.nav > 0);
  } catch (error) {
    console.error(`Failed to fetch NAV history for scheme ${schemeCode}`, error);
    return null;
  }
}

/**
 * Finds the NAV on or immediately before the given date.
 * navHistory is sorted newest-to-oldest, so the first match is the closest NAV.
 */
function findNavOnOrBefore(navHistory: NavEntry[], date: dayjs.Dayjs): NavEntry | null {
  for (const entry of navHistory) {
    if (entry.date.isSameOrBefore(date, "day")) return entry;
  }
  return null;
}

/**
 * Simulates every SIP installment that is due on or before `toDate` and persists
 * them as SipTransaction documents. Updates the parent SIP document's aggregated
 * state so the portfolio behaves exactly as if the SIP had been running since its
 * start date (including backdated SIPs).
 */
export async function processSipInstallments(
  sip: VirtualSip,
  toDate: dayjs.Dayjs = dayjs()
): Promise<SipBackfillResult> {
  let { completedInstallments, totalInvested, totalUnits, nextSipDate, status } = sip;

  // Only active SIPs accumulate installments.
  if (status !== "active") {
    return { processed: 0, completedInstallments, totalInvested, totalUnits, nextSipDate, status };
  }

  let currentInstallmentDate = dayjs(nextSipDate, "YYYY-MM-DD");
  if (!currentInstallmentDate.isValid() || currentInstallmentDate.isAfter(toDate, "day")) {
    return { processed: 0, completedInstallments, totalInvested, totalUnits, nextSipDate, status };
  }

  const navHistory = await fetchNavHistory(sip.schemeCode);
  if (!navHistory) {
    return { processed: 0, completedInstallments, totalInvested, totalUnits, nextSipDate, status };
  }

  const client = await clientPromise;
  const db = client.db("mutualfund");
  const transactionCollection = db.collection<SipTransaction>("sip_transactions");

  let processed = 0;

  // Process ALL past-due installments (start date is the source of truth).
  while (currentInstallmentDate.isSameOrBefore(toDate, "day") && status === "active") {
    const navEntry = findNavOnOrBefore(navHistory, currentInstallmentDate);

    // If no NAV is available for this date, advance to the next month to avoid getting stuck.
    if (!navEntry || navEntry.nav <= 0) {
      currentInstallmentDate = currentInstallmentDate.add(1, "month");
      nextSipDate = currentInstallmentDate.format("YYYY-MM-DD");
      continue;
    }

    const units = sip.sipAmount / navEntry.nav;

    const transaction: Omit<SipTransaction, "_id"> = {
      sipId: sip._id,
      userId: sip.userId,
      schemeCode: sip.schemeCode,
      amount: sip.sipAmount,
      nav: navEntry.nav,
      units,
      transactionDate: currentInstallmentDate.format("YYYY-MM-DD"),
    };
    await transactionCollection.insertOne(transaction as SipTransaction);

    processed++;
    completedInstallments++;
    totalInvested += sip.sipAmount;
    totalUnits += units;

    currentInstallmentDate = currentInstallmentDate.add(1, "month");
    nextSipDate = currentInstallmentDate.format("YYYY-MM-DD");

    // Mark as completed once the total duration has been reached.
    if (sip.durationMonths !== 0 && completedInstallments >= sip.durationMonths) {
      status = "completed";
    }
  }

  if (processed > 0) {
    await db.collection<VirtualSip>("virtual_portfolio").updateOne(
      { _id: sip._id },
      { $set: { completedInstallments, nextSipDate, status, totalUnits, totalInvested } }
    );
  }

  return {
    processed,
    completedInstallments,
    totalInvested,
    totalUnits,
    nextSipDate,
    status,
  };
}
