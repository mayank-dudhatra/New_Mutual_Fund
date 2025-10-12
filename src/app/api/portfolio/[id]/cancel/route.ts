// src/app/api/portfolio/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { VirtualSip } from "@/models/VirtualPortfolio";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const TOKEN_NAME = "authToken";

export async function POST(request: Request, { params }: { params: { id: string }}) {
    const { id } = params;
    const cookieStore = cookies();
    const token = cookieStore.get(TOKEN_NAME);
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    try {
        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
        const userId = new ObjectId(decoded.userId);

        const client = await clientPromise;
        const db = client.db("mutualfund");
        const collection = db.collection<VirtualSip>("virtual_portfolio");

        const result = await collection.updateOne(
            { _id: new ObjectId(id), userId, status: { $in: ['active', 'paused'] } },
            { $set: { status: 'cancelled' } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: "SIP not found or already completed" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "SIP has been cancelled." });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}