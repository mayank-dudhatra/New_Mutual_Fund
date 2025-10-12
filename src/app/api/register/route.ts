// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mutualfund"); // Ensure this is your database name
    const usersCollection = db.collection<User>("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // TypeScript requires a bit of casting here for insertOne without the _id
    const newUser: Omit<User, '_id'> = {
        name,
        email,
        password: hashedPassword,
    };

    const result = await usersCollection.insertOne(newUser as User);

    return NextResponse.json({ success: true, message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}