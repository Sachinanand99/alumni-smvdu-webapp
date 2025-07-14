import { NextResponse } from "next/server";
import * as xlsx from "xlsx";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const entryNumber = searchParams.get("entry")?.trim();

        if (!entryNumber) {
            return NextResponse.json({ error: "Missing entry number." }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public/data.xlsx");

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Excel file not found." }, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });

        // Search across all sheets to find matching entry
        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const rows = xlsx.utils.sheet_to_json<any>(sheet);

            const match = rows.find((row) => {
                return row.entryNumber?.toString().toLowerCase() === entryNumber.toLowerCase();
            });

            if (match) {
                return NextResponse.json({ found: true, alumni: match });
            }
        }

        return NextResponse.json({ found: false, message: "No matching record found." });
    } catch (error) {
        console.error("Error reading Excel:", error);
        return NextResponse.json({ error: "Server error reading Excel file." }, { status: 500 });
    }
}
