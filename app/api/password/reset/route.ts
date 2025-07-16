import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongo from "@/lib/mongodb";
import UserModel from "@/MongoDb/models/User";

export async function POST(req: Request) {
    await connectMongo();

    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
        return NextResponse.json({ error: "Missing token or password." }, { status: 400 });
    }

    try {
        const user = await UserModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }, // must be in the future
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;

        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Reset password error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
