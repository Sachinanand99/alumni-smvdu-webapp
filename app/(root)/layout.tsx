"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();


    useEffect(() => {
        if (status === "loading") return;

        const needsSetup = session?.user?.forceSetup;
        const alreadyThere = pathname === "/profile/profile-setup";

        if (needsSetup && !alreadyThere) {
            toast.info("🚧 Please complete your profile setup.");
            router.push("/profile/profile-setup");
        }
    }, [session, status, pathname, router]);

    return <main className="font-work-sans scroll-smooth">{children}</main>;
}
