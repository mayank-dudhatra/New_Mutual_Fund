// src/app/api/watchlist/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { WatchlistItem } from "@/models/Watchlist";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const TOKEN_NAME = "authToken";

// GET handler to fetch the user's watchlist
export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME);

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
    const userId = new ObjectId(decoded.userId);

    const client = await clientPromise;
    const db = client.db("mutualfund");
    const watchlistCollection = db.collection<WatchlistItem>("watchlist");

    const watchlist = await watchlistCollection.find({ userId }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ watchlist }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
  }
}


// POST handler to add an item to the watchlist
export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME);

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { schemeCode, schemeName } = await request.json();
    if (!schemeCode || !schemeName) {
      return NextResponse.json({ error: "Missing schemeCode or schemeName" }, { status: 400 });
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
    const userId = new ObjectId(decoded.userId);

    const client = await clientPromise;
    const db = client.db("mutualfund");
    const watchlistCollection = db.collection<WatchlistItem>("watchlist");

    // Check if the item already exists
    const existingItem = await watchlistCollection.findOne({ userId, schemeCode });
    if (existingItem) {
      return NextResponse.json({ message: "Item already in watchlist" }, { status: 200 });
    }

    const newItem: Omit<WatchlistItem, '_id'> = {
      userId,
      schemeCode: Number(schemeCode),
      schemeName,
      createdAt: new Date(),
    };

    await watchlistCollection.insertOne(newItem as WatchlistItem);

    return NextResponse.json({ success: true, message: "Added to watchlist" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
  }
}