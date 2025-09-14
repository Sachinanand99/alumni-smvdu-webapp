"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from "@/components/ui/sonner";

const ResetPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("✅ Password updated successfully.");
            } else {
                toast.error(data.error || "❌ Failed to reset password.");
            }
        } catch {
            toast.error("🚨 Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-8 bg-white rounded-lg shadow-md space-y-4 w-80"
        >
            <h2 className="text-xl font-bold text-center">Reset Password</h2>
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
            />
            <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {submitting ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );
};

const ResetPasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
};

export default ResetPasswordPage;
