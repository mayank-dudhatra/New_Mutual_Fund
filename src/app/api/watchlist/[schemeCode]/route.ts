// src/app/api/watchlist/[schemeCode]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const TOKEN_NAME = "authToken";

// DELETE handler to remove an item from the watchlist
export async function DELETE(request: Request, { params }: { params: { schemeCode: string }}) {
    const { schemeCode } = params;
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
        const watchlistCollection = db.collection("watchlist");

        await watchlistCollection.deleteOne({ userId, schemeCode: Number(schemeCode) });

        return NextResponse.json({ success: true, message: "Removed from watchlist" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
    }
}