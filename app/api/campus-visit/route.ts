import { NextResponse } from "next/server";
import { createCampusVisitRequest } from "@/lib/actions";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const formData = await req.json();
        const result = await createCampusVisitRequest(formData);

        if (result.status === "SUCCESS") {
            await sendEmail(
                "New Campus Visit Request",
                `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nBatch: ${formData.batch}\nDescription: ${formData.description}`
            );
            return NextResponse.json({ status: "SUCCESS" });
        }

        return NextResponse.json({ error: "Request failed", status: "ERROR" });

    } catch (error) {
        return NextResponse.json({ error: "Server error", status: "ERROR" });
    }
}
