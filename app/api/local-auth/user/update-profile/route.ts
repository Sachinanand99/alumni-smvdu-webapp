import { NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    await connectMongo();

    try {
        const { universityEmail, personalEmail, password, name, profilePicture, provider } = await req.json();

        console.log("Received data:", provider);

        if (!universityEmail || !personalEmail || !password || !name || !provider) {
            return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 });
        }

        const userExists = await UserModel.findOne({ personalEmail });
        if (userExists) {
            return NextResponse.json({ error: "This personal email is already registered." }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.updateOne({
            universityEmail,
            personalEmail,
            password: hashedPassword,
            name,
            profilePicture: profilePicture || "",
            provider,
        });


        return NextResponse.json({ message: "Account created successfully!", redirect: "/login" }, { status: 200 });

    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Server error, please try again later." }, { status: 500 });
    }
}
