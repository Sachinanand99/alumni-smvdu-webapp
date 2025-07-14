import { NextResponse } from "next/server";
import * as xlsx from "xlsx";
import fs from "fs";
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

        const filePath = path.join(process.cwd(), "public", "data.xlsx");
        const tempPath = filePath + ".tmp";

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Excel file not found!" }, { status: 404 });
        }

        const workbook = xlsx.read(fs.readFileSync(filePath), { type: "buffer" });

        if (!workbook.SheetNames.includes(admissionYear)) {
            workbook.SheetNames.push(admissionYear);
            workbook.Sheets[admissionYear] = xlsx.utils.json_to_sheet([]);
        }

        const sheet = workbook.Sheets[admissionYear];
        const sheetData = xlsx.utils.sheet_to_json<any>(sheet);

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

        workbook.Sheets[admissionYear] = xlsx.utils.json_to_sheet(sheetData);
        try {
            const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });
            fs.writeFileSync(tempPath, buffer);
            fs.renameSync(tempPath, filePath);
            console.log(`✅ Entry ${updated ? "updated" : "added"}: ${entryNumber}`);
        } catch (err) {
            console.error("❌ Failed to write Excel:", err);
            return NextResponse.json({ error: "Failed to write Excel file." }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: updated
                ? "Data successfully updated!"
                : "Data successfully added!",
            sheet: admissionYear,
            row: updatedIndex + 1,
        });
    } catch (error) {
        console.error("❌ Error updating Excel file:", error);
        return NextResponse.json({ error: "Failed to update Excel file." }, { status: 500 });
    }
}
