import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const formData = await req.json();


        const recipientEmail = process.env.RECEIVE_CAMPUS_VISIT_MAIL || process.env.REACT_APP_CONTACT_EMAIL;

        if (!recipientEmail) {
            console.error("Error: No recipient email defined in environment variables.");
            return NextResponse.json({ error: "No recipient email defined", status: "ERROR" });
        }



        const emailContent = `
                    <h2 style="color: #4CAF50;">New Campus Visit Request</h2>
                    <p><strong>Name:</strong> ${formData.name}</p>
                    <p><strong>Email:</strong> ${formData.email}</p>
                    <p><strong>Phone:</strong> ${formData.phone}</p>
                    <p><strong>Batch:</strong> ${formData.batch}</p>
                    <p><strong>Description:</strong> ${formData.description}</p>
                    <p><strong>Visit Date:</strong> ${new Date(formData.comingDate).toLocaleDateString()}</p>
                    <hr/>
                    <p style="color: #888;">This request was submitted via the Campus Visit Form.</p>
        `;

        await sendEmail(`Campus Visit Request - ${formData.name}`, emailContent, recipientEmail);
        return NextResponse.json({ status: "SUCCESS" });

    } catch (error) {
        console.error("Campus Visit Request Error:", error);
        return NextResponse.json({ error: "Server error", status: "ERROR" });
    }
}
