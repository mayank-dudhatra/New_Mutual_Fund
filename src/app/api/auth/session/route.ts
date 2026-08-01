// src/app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const TOKEN_NAME = "authToken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME);

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET);
    // The decoded payload will contain userId, email, name, etc.
    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch (error) {
    console.error("JWT verification error:", error);
    // If token is invalid or expired, tell the client to clear it
    const response = NextResponse.json({ error: "Invalid token" }, { status: 401 });
    response.cookies.set(TOKEN_NAME, '', { maxAge: -1 }); // Expire the cookie
    return response;
  }
}