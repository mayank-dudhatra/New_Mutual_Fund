// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const TOKEN_NAME = "authToken";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mutualfund");
    const usersCollection = db.collection<User>("users");

    const user = await usersCollection.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const userPayload = {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "30d" });

    const serializedCookie = serialize(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: MAX_AGE,
      path: "/",
      sameSite: "strict",
    });

    // **CRITICAL CHANGE**: Return the user data along with the success message
    const response = NextResponse.json(
      { 
        success: true, 
        message: "Logged in successfully", 
        user: { id: userPayload.userId, email: userPayload.email, name: userPayload.name }
      },
      { status: 200 }
    );

    response.headers.set("Set-Cookie", serializedCookie);

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}