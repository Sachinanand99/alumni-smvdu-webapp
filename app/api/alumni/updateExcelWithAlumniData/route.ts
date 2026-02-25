import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: "Unauthorized access. Please sign in." },
            { status: 401 }
        );
    }

    try {
        const formData = await req.json();
        const clean = (val: string) => val?.toString().trim() || "";

        const entryNumber = clean(formData.entryNumber);
        const email = clean(formData.email);
        const admissionYear = `20${parseInt(entryNumber.slice(0, 2)) + 4}`;

        const authClient = new google.auth.GoogleAuth({
            credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth: authClient });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

        const metadata = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetNames = metadata.data.sheets?.map((s) => s.properties?.title) || [];

        if (!sheetNames.includes(admissionYear)) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            addSheet: {
                                properties: { title: admissionYear },
                            },
                        },
                    ],
                },
            });
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: admissionYear,
        });

        const rows = response.data.values || [];
        const headers = rows[0] || [
            "Sno",
            "fullName",
            "email",
            "phone",
            "entryNumber",
            "gender",
            "department",
            "degree",
            "professionalSector",
            "income",
            "countryOfResidence",
            "postalAddress",
            "linkedinProfile",
            "twitterProfile",
            "companyOrInstitute",
            "profilePicture",
        ];

        const sheetData = rows.slice(1).map((row) => {
            const entry: Record<string, string> = {};
            headers.forEach((header, i) => {
                entry[header] = row[i] || "";
            });
            return entry;
        });

        const newEntry = {
            fullName: clean(formData.fullName),
            email,
            phone: clean(formData.phone),
            entryNumber,
            gender: clean(formData.gender),
            department: clean(formData.department),
            degree: clean(formData.degree),
            professionalSector: clean(formData.professionalSector),
            income: clean(formData.income),
            countryOfResidence: clean(formData.countryOfResidence),
            postalAddress: clean(formData.postalAddress),
            linkedinProfile: clean(formData.linkedinProfile),
            twitterProfile: clean(formData.twitterProfile),
            companyOrInstitute: clean(formData.companyOrInstitute),
            profilePicture: clean(formData.profilePicture),
        };

        let updated = false;
        let updatedIndex = -1;

        for (let i = 0; i < sheetData.length; i++) {
            const row = sheetData[i];
            if (
                row.entryNumber?.toLowerCase() === entryNumber.toLowerCase() ||
                row.email?.toLowerCase() === email.toLowerCase()
            ) {
                sheetData[i] = { ...row, ...newEntry, Sno: row.Sno || i + 1 };
                updated = true;
                updatedIndex = i;
                break;
            }
        }

        if (!updated) {
            const Sno = sheetData.length + 1;
            sheetData.push({ Sno, ...newEntry });
            updatedIndex = Sno - 1;
        }

        const updatedRows = [headers, ...sheetData.map((row) => headers.map((h) => row[h] || ""))];

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: admissionYear,
            valueInputOption: "RAW",
            requestBody: { values: updatedRows },
        });

        console.log(`✅ Entry ${updated ? "updated" : "added"}: ${entryNumber}`);

        return NextResponse.json({
            success: true,
            message: updated
                ? "Data successfully updated!"
                : "Data successfully added!",
            sheet: admissionYear,
            row: updatedIndex + 1,
        });
    } catch (error) {
        console.error("❌ Error updating Google Sheet:", error);
        return NextResponse.json({ error: "Failed to update Google Sheet." }, { status: 500 });
    }
}
