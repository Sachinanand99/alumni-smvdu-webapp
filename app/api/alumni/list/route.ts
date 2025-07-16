import { NextResponse } from "next/server";
import * as xlsx from "xlsx";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "public/data.xlsx");

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Excel file not found." }, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });

        const sheetNames = workbook.SheetNames;
        const allRows: any[] = [];

        for (const sheetName of sheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const rows = xlsx.utils.sheet_to_json<any>(sheet);

            rows.forEach(row => {
                allRows.push({
                    ...row,
                    graduationYear: sheetName,
                });
            });
        }

        return NextResponse.json({
            rows: allRows.filter(r => r.fullName || r.entryNumber),
            sheetNames,
        });
    } catch (error) {
        console.error("Error reading Excel:", error);
        return NextResponse.json({ error: "Server error reading Excel file." }, { status: 500 });
    }
}
