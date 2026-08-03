// src/app/api/mf/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface ActiveFundDoc {
  code: number;
  name: string;
  nav: string | number;
  date: string;
  last_updated_on?: string;
}

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("mutualfund");
    const collection = db.collection<ActiveFundDoc>("activefunds");

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Fetch active funds directly from MongoDB.
    const docs = await collection.find({}).skip(skip).limit(limit).toArray();
    const totalFunds = await collection.countDocuments();

    const funds = docs.map((doc) => ({
      schemeCode: doc.code,
      schemeName: doc.name,
      nav: typeof doc.nav === "number" ? doc.nav : parseFloat(doc.nav),
      navDate: doc.date,
    }));

    return NextResponse.json({
      total: totalFunds,
      page,
      limit,
      funds,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
