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

export const sendEmail = async (subject: string, message: string) => {
    try {
        await transporter.sendMail({
            from: `"Campus Visit Request" <${process.env.EMAIL_USER}>`,
            to: process.env.GUEST_HOUSE_REGISTRATION_EMAIL,
            subject,
            text: message,
        });
        return { success: true };
    } catch (error) {
        console.error("Email Error:", error);
        return { success: false };
    }
};
