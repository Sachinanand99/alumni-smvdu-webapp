import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const entryNumber = searchParams.get("entry")?.trim();

        if (!entryNumber) {
            return NextResponse.json({ error: "Missing entry number." }, { status: 400 });
        }

        const auth = new google.auth.GoogleAuth({
            credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

        const metadata = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetNames = metadata.data.sheets?.map((s) => s.properties?.title) || [];

        for (const sheetName of sheetNames) {
            if (!sheetName) continue;

            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: sheetName, // fetch whole sheet
            });

            const rows = response.data.values || [];
            if (!rows.length) continue;

            const headers = rows[0];
            const data = rows.slice(1).map((row) => {
                const entry: Record<string, string> = {};
                headers.forEach((header, i) => {
                    entry[header] = row[i] || "";
                });
                return entry;
            });

            const match = data.find(
                (row) => row.entryNumber?.toString().toLowerCase() === entryNumber.toLowerCase()
            );

            if (match) {
                return NextResponse.json({ found: true, alumni: match, sheet: sheetName });
            }
        }

        return NextResponse.json({ found: false, message: "No matching record found in any sheet." });
    } catch (error) {
        console.error("Error reading Google Sheets:", error);
        return NextResponse.json({ error: "Server error reading Google Sheets." }, { status: 500 });
    }
}
