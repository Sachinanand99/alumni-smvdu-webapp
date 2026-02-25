import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const generateUniqueFilename = (originalName: string) => {
  const ext = originalName.split(".").pop();
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const timeStamp = new Date().toISOString().replace(/[:.]/g, "-");
  const randomHash = Math.random().toString(36).substring(2, 8);
  return `${baseName}_${timeStamp}_${randomHash}.${ext}`;
};

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueName = generateUniqueFilename(file.name);

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ public_id: uniqueName, folder: "alumni_profiles" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      name: uniqueName,
      url: (result as any).secure_url, // Cloudinary public URL
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
};
