// src/app/api/portfolio/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const TOKEN_NAME = "authToken";

// GET handler to fetch a single virtual SIP along with its transaction history
export async function GET(request: Request, { params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME);
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    try {
        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
        const userId = new ObjectId(decoded.userId);

        const client = await clientPromise;
        const db = client.db("mutualfund");
        const portfolioCollection = db.collection("virtual_portfolio");

        const sip = await portfolioCollection.findOne({ _id: new ObjectId(id), userId });
        if (!sip) return NextResponse.json({ error: "SIP not found" }, { status: 404 });

        const transactionCollection = db.collection("sip_transactions");
        const transactions = await transactionCollection
            .find({ sipId: new ObjectId(id), userId })
            .sort({ transactionDate: 1 })
            .toArray();

        return NextResponse.json({ sip, transactions }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
    }
}

// DELETE handler to remove a virtual SIP
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME);

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
        const userId = new ObjectId(decoded.userId);

        const client = await clientPromise;
        const db = client.db("mutualfund");
        const portfolioCollection = db.collection("virtual_portfolio");

        const result = await portfolioCollection.deleteOne({ 
            _id: new ObjectId(id),
            userId: userId // Ensure users can only delete their own SIPs
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "SIP not found or you do not have permission to delete it" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Removed SIP from portfolio" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid token or server error" }, { status: 500 });
    }
}