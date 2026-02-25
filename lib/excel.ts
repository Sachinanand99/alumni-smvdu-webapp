import { google } from "googleapis";
import path from "path";

export default async function readGoogleSheetData(fields: string[] = []) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

        const metadata = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetNames = metadata.data.sheets?.map((s) => s.properties?.title) || [];

        const allData: any[] = [];

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
                    if (fields.length === 0 || fields.includes(header)) {
                        entry[header] = row[i] || "";
                    }
                });

                return {
                    ...entry,
                    graduationYear: sheetName, // sheet name as graduation year
                    universityEmail: entry.entryNumber
                        ? `${entry.entryNumber}@smvdu.ac.in`
                        : null,
                };
            });

            allData.push(...data);
        }

        return allData;
    } catch (error) {
        console.error("Error reading Google Sheets:", error);
        return [];
    }
}
