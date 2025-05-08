import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import UserModel from "@/models/User";

export async function POST(req: Request) {
    await connectMongo();

    try {
        const body = await req.json();
        console.log("Received data:", body); // Debugging step

        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }

        const userExists = await UserModel.findOne({ email });

        return NextResponse.json({ exists: userExists !== null }, { status: 200 });

    } catch (error) {
        console.error("Error checking user existence:", error);
        return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
    }
}

