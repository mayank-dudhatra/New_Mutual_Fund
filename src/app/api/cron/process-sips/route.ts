// src/app/api/cron/process-sips/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { VirtualSip } from "@/models/VirtualPortfolio";
import dayjs from "dayjs";
import { processSipInstallments } from "@/lib/sipBackfill";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mutualfund");
    const portfolioCollection = db.collection<VirtualSip>("virtual_portfolio");

    const dueSips = await portfolioCollection.find({ status: "active" }).toArray();

    if (dueSips.length === 0) {
      return NextResponse.json({ message: "No active SIPs to process." });
    }

    let processedCount = 0;
    let installmentCount = 0;
    for (const sip of dueSips) {
      const result = await processSipInstallments(sip, dayjs());
      if (result.processed > 0) {
        processedCount++;
        installmentCount += result.processed;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Checked ${dueSips.length} SIPs. Updated ${processedCount} with ${installmentCount} installment(s).`,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
