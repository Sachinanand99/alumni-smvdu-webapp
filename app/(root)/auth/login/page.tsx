"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "@/components/ui/sonner";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        setLoading(false);

        console.log(res);

        if (res?.ok && !res?.error) {
            toast.success("✅ Login successful!");
            router.push("/");
        } else {
            toast.error("❌ Invalid credentials. Please try again.");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-md space-y-4 w-80">
                <h2 className="text-xl font-bold text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Personal Email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>


                {message && <p className="text-sm text-center text-red-500">{message}</p>}

                <div className="flex justify-between text-sm text-gray-500">
                    <a href="/auth/forgot-password" className="hover:underline">Forgot Password?</a>
                    <a href="/auth/register" className="hover:underline">Create an Account</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
