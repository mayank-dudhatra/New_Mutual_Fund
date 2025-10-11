// src/app/api/mf/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Scheme } from "@/types/scheme";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("mutualfund");
    const collection = db.collection<Scheme>("funds");

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Fetch paginated data directly from MongoDB
    const funds = await collection.find({}).skip(skip).limit(limit).toArray();
    const totalFunds = await collection.countDocuments();

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