import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (subject: string, message: string, recipientEmail?: string) => {
    try {
        const toEmail = recipientEmail?.trim() || process.env.RECEIVE_CAMPUS_VISIT_MAIL?.trim();

        if (!toEmail) {
            console.error("Error: No recipient email defined.");
            return { success: false, error: "No recipient email provided" };
        }

        await transporter.sendMail({
            from: `"Campus Visit Request" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject,
            text: message,
            html: `<html lang="en-US"><body style="font-family: Arial, sans-serif; padding: 20px;"><p>${message.replace(/\n/g, "<br>")}</p></body></html>`, // HTML formatting
        });

        return { success: true };
    } catch (error) {
        console.error("Email Error:", error);
        return { success: false, error: error.message };
    }
};
