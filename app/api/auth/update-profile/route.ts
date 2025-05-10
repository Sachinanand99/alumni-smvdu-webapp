import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from "@/auth";
import connectDB from '@/lib/mongodb';
import User from '@/MongoDb/models/User';

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const { personalEmail, password, name, profilePicture, provider } = await req.json();

        if (!personalEmail || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await connectDB();

        let user = await User.findOne({ universityEmail: session.user.email });
        if (!user) {
            user = await User.findOne({ personalEmail: session.user.email });
        }

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        user.personalEmail = personalEmail;
        user.password = hashedPassword;
        user.name = name;
        user.profilePicture = profilePicture || user.profilePicture;
        user.provider = provider || user.provider;

        await user.save();

        return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
