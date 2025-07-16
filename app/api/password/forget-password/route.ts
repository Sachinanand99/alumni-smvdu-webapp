import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import UserModel from "@/MongoDb/models/User";
import connectMongo from "@/lib/mongodb";



export async function POST(req: Request) {
    await connectMongo();
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
        return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    try {
        const user = await UserModel.findOne({ personalEmail: email });
        if (!user) {
            return NextResponse.json({ error: "No user found with this email." }, { status: 404 });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiry = tokenExpiry;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            to: user.personalEmail,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Forgot password error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
