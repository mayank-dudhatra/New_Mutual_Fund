// src/app/api/portfolio/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { VirtualSip } from "@/models/VirtualPortfolio";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";
import { processSipInstallments } from "@/lib/sipBackfill";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const TOKEN_NAME = "authToken";

// GET handler to fetch all virtual SIPs for the current user
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME);
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
    const userId = new ObjectId(decoded.userId);

    const client = await clientPromise;
    const db = client.db("mutualfund");
    const portfolioCollection = db.collection<VirtualSip>("virtual_portfolio");

    const sips = await portfolioCollection.find({ userId }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ sips }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
  }
}

// POST handler to create a new virtual SIP
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME);
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { schemeCode, schemeName, sipAmount, startDate, durationMonths } = await request.json();
    if (!schemeCode || !schemeName || !sipAmount || !startDate || durationMonths === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
    const userId = new ObjectId(decoded.userId);

    const client = await clientPromise;
    const db = client.db("mutualfund");
    const portfolioCollection = db.collection<VirtualSip>("virtual_portfolio");

    const newSip: Omit<VirtualSip, '_id'> = {
      userId,
      schemeCode: Number(schemeCode),
      schemeName,
      sipAmount: Number(sipAmount),
      startDate,
      durationMonths: Number(durationMonths),
      status: 'active',
      completedInstallments: 0,
      nextSipDate: startDate,
      totalUnits: 0,
      totalInvested: 0,
      redeemed: false,
      createdAt: new Date(),
    };

    const result = await portfolioCollection.insertOne(newSip as VirtualSip);
    const createdSip = { _id: result.insertedId, ...newSip } as VirtualSip;

    // Backfill any missed installments caused by a past start date so the
    // portfolio immediately reflects the SIP as if it had been running since then.
    const backfill = await processSipInstallments(createdSip, dayjs());
    if (backfill.processed > 0) {
      createdSip.completedInstallments = backfill.completedInstallments;
      createdSip.totalInvested = backfill.totalInvested;
      createdSip.totalUnits = backfill.totalUnits;
      createdSip.nextSipDate = backfill.nextSipDate;
      createdSip.status = backfill.status;
    }

    return NextResponse.json({ success: true, sip: createdSip }, { status: 201 });
  } catch (error) {
    console.error("Error creating SIP:", error);
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
  }
}