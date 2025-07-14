"use client";

import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { addGalleryImage } from "@/lib/actions";

const GalleryUploadForm = ({ eventId }: { eventId: string }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [caption, setCaption] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleUpload = () => {
        startTransition(async () => {
            if (!imageFile) {
                toast("⛔ Please select an image file.");
                return;
            }

            const formData = new FormData();
            formData.append("file", imageFile);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json();
            if (!uploadData.success) {
                toast("❌ Upload failed.");
                return;
            }

            const imageUrl = `/uploads/${uploadData.name}`;
            const res = await addGalleryImage(eventId, imageUrl, caption);
            if (res.status === "SUCCESS") {
                toast("✅ Image added to gallery.");
                setImageFile(null);
                setCaption("");
                router.refresh();
            } else {
                toast("❌ Failed to save image.");
            }
        });
    };

    return (
        <div className="border p-4 rounded-md mt-6 bg-white shadow">
            <h3 className="font-semibold mb-2 text-lg">Upload Gallery Image</h3>
            <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <Input
                placeholder="Optional caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-2"
            />
            <Button className="mt-4" onClick={handleUpload} disabled={isPending}>
                {isPending ? "Uploading..." : "Upload"}
            </Button>
        </div>
    );
};

export default GalleryUploadForm;
