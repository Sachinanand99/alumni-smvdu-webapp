"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from "@/components/ui/sonner";

const ProfileSetupPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [personalEmail, setPersonalEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (!session?.user) {
            router.push("/auth/login");
        }
    }, [session, status, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/auth/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    universityEmail: session?.user?.email,
                    personalEmail,
                    password,
                    name: session?.user?.name,
                    profilePicture: session?.user?.image || "",
                    provider: session?.user?.provider || "local",
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("✅ Profile saved. Please log in again.");
                await signOut();
                router.push("/auth/login");
            } else {
                toast.error(data.error || "❌ Something went wrong.");
            }
        } catch {
            toast.error("🚨 Could not update profile. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-md space-y-4 w-80">
                <h2 className="text-xl font-bold text-center">Profile Setup</h2>
                <p className="text-sm text-gray-500 text-center">
                    Register with your personal email and set a password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        value={session?.user?.email || ""}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200"
                    />
                    <input
                        type="email"
                        value={personalEmail}
                        onChange={(e) => setPersonalEmail(e.target.value)}
                        placeholder="Personal Email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetupPage;
