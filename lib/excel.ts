import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import AlumniModel from "@/MongoDb/models/Alumni";
import connectMongo from "@/lib/mongodb";

// TODO

const getYearFromEntryNumber = (entryNumber: string): string | null => {
    const match = entryNumber.match(/(\d{2})[A-Za-z]+/);
    return match ? `20${match[1]}` : null;
};

export const generateExcelFiles = async () => {
    await connectMongo();

    const alumniData = await AlumniModel.find({}).lean();

    const groupedAlumni: Record<string, any[]> = {};
    alumniData.forEach((alumni) => {
        const year = getYearFromEntryNumber(alumni.entryNumber);
        if (year) {
            groupedAlumni[year] = groupedAlumni[year] || [];
            groupedAlumni[year].push(alumni);
        }
    });

    for (const [year, data] of Object.entries(groupedAlumni)) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${year} Alumni`);

        worksheet.columns = [
            { header: "Full Name", key: "fullName", width: 20 },
            { header: "Email", key: "email", width: 30 },
            { header: "Phone", key: "phone", width: 15 },
            { header: "Entry Number", key: "entryNumber", width: 10 },
            { header: "Department", key: "department", width: 15 },
            { header: "Degree", key: "degree", width: 20 },
            { header: "Company", key: "companyOrInstitute", width: 25 },
        ];

        worksheet.addRows(data);
        const filePath = path.join("./public/excel_files", `${year}_Alumni.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        console.log(`Excel file for batch ${year} updated successfully!`);
    }
};
