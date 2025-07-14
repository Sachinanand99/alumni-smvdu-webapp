"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { deleteGalleryImage } from "@/lib/actions";

interface Props {
    images: { _id: string; url: string; caption?: string }[];
    isAdmin: boolean;
}

export const GallerySection = ({ images, isAdmin }: Props) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const res = await deleteGalleryImage(id);
            if (res.status === "SUCCESS") {
                toast("🖼️ Image deleted");
                router.refresh();
            } else {
                toast("❌ Failed to delete image");
            }
        });
    };

    return (
        <section className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map(img => (
                    <div key={img._id} className="relative">
                        <img src={img.url} alt={img.caption || "Gallery image"} className="rounded-lg shadow" />
                        {isAdmin && (
                            <Button
                                size="sm"
                                className="absolute top-2 right-2 bg-red-600"
                                onClick={() => handleDelete(img._id)}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
