"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const DeleteEventButton = ({ id }: { id: string }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteEvent(id);
            if (res.status === "SUCCESS") {
                    toast("🗑️ Event deleted successfully.")
                router.push("/events");
            } else {
                toast("❌ Deletion Failed");
            }
        });
    };

    return (
        <Button
            className="bg-red-600 hover:bg-red-500"
            disabled={isPending}
            onClick={handleDelete}
        >
            {isPending ? "Deleting..." : "Delete"}
        </Button>
    );
};

export default DeleteEventButton;
