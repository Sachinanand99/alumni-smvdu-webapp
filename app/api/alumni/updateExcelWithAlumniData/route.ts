import { NextResponse } from "next/server";
import * as xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user?.email) {
        return NextResponse.json(
            { error: "Unauthorized access. Please sign in." },
            { status: 401 }
        );
    }

    try {
        const formData = await req.json();

        const clean = (val: string) => val?.toString().trim() || "";

        const entryNumber = clean(formData.entryNumber);
        const admissionYear = `${parseInt(entryNumber.substring(0, 2)) + 4}`;

        const filePath = path.join(process.cwd(), "init/data.xlsx");
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Excel file not found!" }, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });

        if (!workbook.SheetNames.includes(admissionYear)) {
            workbook.SheetNames.push(admissionYear);
            workbook.Sheets[admissionYear] = xlsx.utils.json_to_sheet([]);
        }

        const sheet = workbook.Sheets[admissionYear];
        const sheetData = xlsx.utils.sheet_to_json<any>(sheet);

        const isDuplicate = sheetData.some((row) =>
            row.entryNumber?.toLowerCase() === entryNumber.toLowerCase() ||
            row.email?.toLowerCase() === clean(formData.email).toLowerCase()
        );

        if (isDuplicate) {
            return NextResponse.json(
                { error: "User already submitted their information." },
                { status: 409 }
            );
        }

        const newEntry = {
            Sno: sheetData.length + 1,
            fullName: clean(formData.fullName),
            email: clean(formData.email),
            phone: clean(formData.phone),
            entryNumber,
            Gender: clean(formData.gender),
            department: clean(formData.department),
            degree: clean(formData.degree),
            professionalSector: clean(formData.professionalSector),
            income: clean(formData.income),
            countryOfResidence: clean(formData.countryOfResidence),
            postalAddress: clean(formData.postalAddress),
            linkedinProfile: clean(formData.linkedinProfile),
            twitterProfile: clean(formData.twitterProfile),
            companyOrInstitute: clean(formData.companyOrInstitute),
        };

        console.log(`[Alumni Entry Saved] ${entryNumber}`, newEntry);

        sheetData.push(newEntry);
        workbook.Sheets[admissionYear] = xlsx.utils.json_to_sheet(sheetData);

        // TODO: permission error fix later
        try {
            xlsx.writeFile(workbook, filePath);
        } catch (err) {
            console.error("Failed to write Excel:", err);
            return NextResponse.json({ error: "Write permission denied or file locked." }, { status: 500 });
        }
        return NextResponse.json({
            success: true,
            message: "Data successfully updated!",
            sheet: admissionYear,
            row: newEntry.Sno,
        });
    } catch (error) {
        console.error("Error updating Excel file:", error);
        return NextResponse.json({ error: "Failed to update Excel file." }, { status: 500 });
    }
}
