import fs from "fs";
import path from "path";
import * as xlsx from "xlsx";

export default async function readXlsxData(fields: string[] = []) {
    try {
        const filePath = path.join(process.cwd(), "init/data.xlsx");

        if (!fs.existsSync(filePath)) {
            console.error("File not found:", filePath);
            return [];
        }

        const fileBuffer = fs.readFileSync(filePath);
        const workbook = xlsx.read(fileBuffer, { type: "buffer" });

        return workbook.SheetNames.flatMap(sheetName =>
            xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]).map(entry => {
                const filteredEntry = fields.length > 0
                    ? Object.fromEntries(
                        Object.entries(entry).filter(([key]) => fields.includes(key))
                    )
                    : entry;

                return {
                    ...filteredEntry,
                    graduationYear: sheetName,
                    universityEmail: entry.entryNumber ? `${entry.entryNumber}@smvdu.ac.in` : null,
                };
            })
        );
    } catch (error) {
        console.error("Error reading XLSX data:", error);
        return [];
    }
}
