// https://javascript.plainenglish.io/file-upload-with-next-js-14-app-router-6cb0e594e778
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Adjust to your actual ROOT_PATH environment variable and target folder
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads/alumni");

// Generates a unique name by appending timestamp and random hash
const generateUniqueFilename = (originalName: string) => {
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const timeStamp = new Date().toISOString().replace(/[:.]/g, "-");
    const randomHash = Math.random().toString(36).substring(2, 8);
    return `${baseName}_${timeStamp}_${randomHash}${ext}`;
};

export const POST = async (req: NextRequest) => {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const file = (body.file as Blob) || null;

    if (!file) {
        return NextResponse.json({ success: false });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const originalName = (body.file as File).name;
    const uniqueName = generateUniqueFilename(originalName);
    const filePath = path.resolve(UPLOAD_DIR, uniqueName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
        success: true,
        name: uniqueName,
    });
};