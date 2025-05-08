"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const AuthGuard = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) router.push("/login");
    }, [session, status]);

    if (status === "loading") return <p>Loading...</p>;
    return session ? children : null;
};

export default AuthGuard;
