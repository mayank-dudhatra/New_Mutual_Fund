// src/app/api/portfolio/[id]/redeem/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { VirtualSip } from "@/models/VirtualPortfolio";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const TOKEN_NAME = "authToken";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME);
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    try {
        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
        const userId = new ObjectId(decoded.userId);

        const client = await clientPromise;
        const db = client.db("mutualfund");
        const collection = db.collection<VirtualSip>("virtual_portfolio");
        
        const sip = await collection.findOne({ _id: new ObjectId(id), userId });

        if (!sip) {
            return NextResponse.json({ error: "SIP not found" }, { status: 404 });
        }

        // Fetch latest NAV to calculate redeemed value
        const res = await fetch(`https://api.mfapi.in/mf/${sip.schemeCode}`);
        const data = await res.json();
        const latestNav = parseFloat(data.data[0].nav);
        const redeemedValue = sip.totalUnits * latestNav;

        const result = await collection.updateOne(
            { _id: new ObjectId(id), userId },
            { $set: { status: 'completed', redeemed: true, redeemedOn: new Date(), redeemedValue: redeemedValue } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: "Failed to redeem SIP" }, { status: 500 });
        }
        return NextResponse.json({ success: true, message: "SIP has been redeemed." });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}