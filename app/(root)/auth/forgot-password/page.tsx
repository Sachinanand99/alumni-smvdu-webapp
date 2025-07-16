"use client";

import React, { useState } from "react";
import { toast } from "@/components/ui/sonner";

const ForgetPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/password/forget-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("✅ Password reset link sent to your email.");
            } else {
                toast.error(data.error || "❌ Failed to send reset link.");
            }
        } catch(error){
            console.log(error);
            toast.error("🚨 Something went wrong. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-md space-y-4 w-80">
                <h2 className="text-xl font-bold text-center">Forgot Password</h2>
                <p className="text-sm text-gray-500 text-center">
                    Enter your registered email address.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {submitting ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgetPasswordPage;
