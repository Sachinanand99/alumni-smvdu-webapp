import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";

export async function GET() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

        const metadata = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetNames = metadata.data.sheets?.map((s) => s.properties?.title) || [];

        const allRows: any[] = [];

        for (const sheetName of sheetNames) {
            if (!sheetName) continue;

            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: sheetName, // fetch entire sheet
            });

            const rows = response.data.values || [];
            if (!rows.length) continue;

            const headers = rows[0];
            const data = rows.slice(1).map((row) => {
                const entry: Record<string, string> = {};
                headers.forEach((header, i) => {
                    entry[header] = row[i] || "";
                });
                return {
                    ...entry,
                    graduationYear: sheetName, // sheet name as graduation year
                };
            });

            allRows.push(...data);
        }

        return NextResponse.json({
            rows: allRows.filter((r) => r.fullName || r.entryNumber),
            sheetNames,
        });
    } catch (error) {
        console.error("Error reading Google Sheets:", error);
        return NextResponse.json({ error: "Server error reading Google Sheets." }, { status: 500 });
    }
}
