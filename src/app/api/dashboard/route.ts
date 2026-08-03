// src/app/api/dashboard/route.ts
// Read-only aggregation used by the Home dashboard "Top Movers" + ticker.
// Samples a handful of equity funds from the activefunds collection,
// computes latest NAV + returns from the cached AMFI data, and returns
// top gainers/losers by 1D change.
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getScheme } from "@/lib/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

const SAMPLE_SIZE = 24;
const MAX_ITEMS = 6;

interface Mover {
  schemeCode: number;
  schemeName: string;
  nav: number;
  dayChange: number | null;
  oneMonth: number | null;
  threeMonths: number | null;
  oneYear: number | null;
}

interface FundDoc {
  schemeCode: number;
  schemeName: string;
}

interface NavPoint {
  date: dayjs.Dayjs;
  nav: number;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mutualfund");
    const collection = db.collection("activefunds");

    // Sample a handful of equity-ish schemes for a sensible "market movers"
    // list. activefunds has no schemeType, so filter by fund-name keywords;
    // fall back to a random sample if the keyword filter comes up empty.
    let sampled: FundDoc[] = [];
    try {
      sampled = (await collection
        .aggregate([
          {
            $match: {
              name: {
                $regex: "Large Cap|Flexi Cap|Mid Cap|Small Cap|ELSS|Multi Cap|Value|Index",
                $options: "i",
              },
            },
          },
          { $sample: { size: SAMPLE_SIZE } },
          { $project: { _id: 0, schemeCode: "$code", schemeName: "$name" } },
        ])
        .toArray()) as unknown as FundDoc[];
    } catch {
      sampled = [];
    }
    if (sampled.length < 10) {
      sampled = (await collection
        .aggregate([
          { $sample: { size: SAMPLE_SIZE } },
          { $project: { _id: 0, schemeCode: "$code", schemeName: "$name" } },
        ])
        .toArray()) as unknown as FundDoc[];
    }

    const settled = await Promise.allSettled(
      sampled.map(async (fund) => {
        const scheme = await getScheme(String(fund.schemeCode));
        const raw: { date: string; nav: string }[] = scheme?.data ?? [];
        if (!Array.isArray(raw) || raw.length < 2) return null;

        const history: NavPoint[] = raw
          .map((d) => ({ date: dayjs(d.date, "DD-MM-YYYY"), nav: parseFloat(d.nav) }))
          .filter((h) => h.nav > 0 && h.date.isValid())
          .sort((a, b) => a.date.unix() - b.date.unix());

        if (history.length < 2) return null;

        const latest = history[history.length - 1];
        const prev = history[history.length - 2];
        const dayChange = prev.nav > 0 ? ((latest.nav - prev.nav) / prev.nav) * 100 : null;

        const changeOver = (amount: number, unit: "month" | "year") => {
          const target = latest.date.subtract(amount, unit);
          const start = history.find((h) => h.date.isSameOrAfter(target));
          if (!start || start.date.isSame(latest.date, "day") || start.nav <= 0) return null;
          return ((latest.nav - start.nav) / start.nav) * 100;
        };

        return {
          schemeCode: fund.schemeCode,
          schemeName: fund.schemeName,
          nav: latest.nav,
          dayChange,
          oneMonth: changeOver(1, "month"),
          threeMonths: changeOver(3, "month"),
          oneYear: changeOver(1, "year"),
        } as Mover;
      })
    );

    const items = settled
      .filter((r) => r.status === "fulfilled" && r.value !== null)
      .map((r) => (r as PromiseFulfilledResult<Mover>).value);

    const withDay = items.filter((i) => i.dayChange != null);
    const gainers = [...withDay].sort((a, b) => (b.dayChange ?? 0) - (a.dayChange ?? 0)).slice(0, MAX_ITEMS);
    const losers = [...withDay].sort((a, b) => (a.dayChange ?? 0) - (b.dayChange ?? 0)).slice(0, MAX_ITEMS);

    return NextResponse.json({ gainers, losers });
  } catch (err) {
    console.error("Dashboard aggregation failed:", err);
    return NextResponse.json({ gainers: [], losers: [] });
  }
}
