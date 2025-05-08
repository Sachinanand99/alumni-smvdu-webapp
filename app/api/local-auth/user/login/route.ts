import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
    await connectMongo();

    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        const user = await UserModel.findOne({ personalEmail: email });
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        const jwt = await new SignJWT({ id: user._id, email: user.personalEmail, name: user.name })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(new TextEncoder().encode(process.env.AUTH_SECRET));

        const response = new NextResponse(
            JSON.stringify({ message: "Login successful!", user }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

        response.cookies.set("next-auth.session-token", jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60,
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
    }
}
