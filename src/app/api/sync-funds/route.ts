// src/app/api/sync-funds/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Scheme } from "@/types/scheme";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mutualfund"); // database name
    const collection = db.collection<Scheme>("funds"); // collection name

    // Fetch all mutual funds
    const response = await fetch("https://api.mfapi.in/mf");
    if (!response.ok) {
      throw new Error("Failed to fetch data from MF API");
    }
    const allFunds = await response.json();

    // **MODIFIED CONDITION:** Filter for funds where either isinGrowth or isinDivReinvestment is not null
    const activeFunds = allFunds.filter(
      (fund: any) => fund.isinGrowth !== null || fund.isinDivReinvestment !== null
    );

    // Optional: Clear the collection before inserting new data
    await collection.deleteMany({});

    // Insert the active funds into the database
    const result = await collection.insertMany(activeFunds);

    return NextResponse.json({
      success: true,
      message: `${result.insertedCount} active funds have been synced to the database.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}