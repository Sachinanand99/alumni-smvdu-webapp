"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const ProfileSetupPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [personalEmail, setPersonalEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (!session || !session.user) {
            router.push("/auth/login");
        }
    }, [session, status, router]);

    useEffect(() => {
        const checkUserExists = async () => {
            if (!session?.user?.email) return;

            const response = await fetch("/api/local-auth/user/check-existence", {
                method: "POST",
                body: JSON.stringify({ personalEmail }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (data.exists) {
                setAlreadyRegistered(true);
            }
        };

        if (session?.user?.email) checkUserExists();
    }, [session]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("/api/auth/update-profile", {
            method: "POST",
            body: JSON.stringify({
                universityEmail: session?.user?.email,
                personalEmail,
                password,
                name: session?.user?.name,
                profilePicture: session?.user?.image || "",
                provider: session?.user?.provider || "local",
            }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
            await signOut();
            router.push("/auth/login");
        } else {
            setMessage(data.error || "Something went wrong");
        }
    };

    return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="p-8 bg-white rounded-lg shadow-md space-y-4 w-80">
                    <h2 className="text-xl font-bold text-center">Profile Setup</h2>
                    <p className="text-sm text-gray-500 text-center">Register with your personal email and set a password.</p>

                    {alreadyRegistered ? (
                        <p className="text-red-500 text-center">You have already created an account.</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="email"
                                value={session?.user?.email || ""}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200"
                            />
                            <input
                                type="email"
                                value={personalEmail || ""}
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
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Save Changes
                            </button>
                        </form>
                    )}

                    {message && <p className="text-sm text-center text-red-500">{message}</p>}
                </div>
            </div>
    );
};

export default ProfileSetupPage;
