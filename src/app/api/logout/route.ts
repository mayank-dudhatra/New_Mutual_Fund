// src/app/api/logout/route.ts
import { NextResponse } from "next/server";
import { serialize } from "cookie";

const TOKEN_NAME = "authToken";

export async function POST() {
  // To log out, we send back a cookie with the same name but that is already expired.
  const serializedCookie = serialize(TOKEN_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: -1, // Expire the cookie immediately
    path: "/",
    sameSite: "strict",
  });

  const response = NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });
  response.headers.set("Set-Cookie", serializedCookie);

  return response;
}