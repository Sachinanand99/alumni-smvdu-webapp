import AlumniFilter from "@/components/utils/AlumniFilter";
import AlumniCard from "@/components/cards/AlumniCard";
import UserModel from "@/MongoDb/models/User"
import connectMongo from "@/lib/mongodb";
import readXlsxData from "@/lib/excel"
import { toast } from "@/components/ui/sonner";

async function fetchMongoData() {
    try {
        await connectMongo();
        return await UserModel.find({ universityEmail: /@smvdu.ac.in$/ }).lean();
    } catch (error) {
        console.error("Error fetching MongoDB data:", error);
        toast.error("❌ Failed to load alumni data. Please try again.");
        return [];
    }
}

async function getMergedData() {
    const excelData = await readXlsxData(["fullName", "entryNumber", "companyOrInstitute", "professionalSector"]);
    const mongoData = await fetchMongoData();

    const alumniMap = new Map();

    excelData.forEach(entry => {
        const email = entry.entryNumber ? `${entry.entryNumber}@smvdu.ac.in` : null;
        const matchingMongoEntry = mongoData.find(person => person?.universityEmail.toLowerCase() === email?.toLowerCase());

        if (alumniMap.has(entry.entryNumber)) {
            const existingEntry = alumniMap.get(entry.entryNumber);

            if (!Array.isArray(existingEntry.companyOrInstitute)) {
                existingEntry.companyOrInstitute = existingEntry.companyOrInstitute ? [existingEntry.companyOrInstitute] : [];
            }
            if (entry.companyOrInstitute) {
                existingEntry.companyOrInstitute.push(entry.companyOrInstitute.trim());
            }
            existingEntry.companyOrInstitute = Array.from(new Set(existingEntry.companyOrInstitute)).join(", ");

            if (!Array.isArray(existingEntry.professionalSector)) {
                existingEntry.professionalSector = existingEntry.professionalSector ? [existingEntry.professionalSector] : [];
            }
            if (entry.professionalSector) {
                existingEntry.professionalSector.push(entry.professionalSector.trim());
            }
            existingEntry.professionalSector = Array.from(new Set(existingEntry.professionalSector)).join(", ");
        } else {
            alumniMap.set(entry.entryNumber, {
                ...entry,
                universityEmail: email,
                profilePicture: matchingMongoEntry?.profilePicture || null,
                companyOrInstitute: entry.companyOrInstitute ? [entry.companyOrInstitute.trim()] : [],
                professionalSector: entry.professionalSector ? [entry.professionalSector.trim()] : []
            });
        }
    });

    return Array.from(alumniMap.values());
}

const Page = async ({ searchParams }: { searchParams: { query?: string; dept?: string ; page?: string } }) => {
    const { query = "", dept = "all", page = "1" } = await searchParams;
    const currentPage = parseInt(page, 10) || 1;
    const pageSize = 50;

    const allAlumni = await getMergedData();

    const filteredAlumni = allAlumni.filter(person => {
        const matchesQuery = query ? person.fullName?.toLowerCase().includes(query.toLowerCase()) : true;        const matchesDepartment = dept && dept !== "all" ? person.department === dept : true;
        return matchesQuery && matchesDepartment;
    });

    const totalPages = Math.ceil(filteredAlumni.length / pageSize);
    const paginatedAlumni = filteredAlumni.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="flex gap-x-3 p-5">
            <AlumniFilter query={query} alumni={allAlumni} />
            <div>
                <div className="flex justify-center gap-4 mt-5">
                    {currentPage > 1 && (
                        <a href={`?query=${encodeURIComponent(query)}&dept=${encodeURIComponent(dept)}&page=${currentPage - 1}`} className="px-4 py-2 bg-gray-200 rounded">
                            Previous
                        </a>
                    )}
                    <span className="px-4 py-2 font-semibold">Page {currentPage} of {totalPages}</span>
                    {currentPage < totalPages && (
                        <a href={`?query=${encodeURIComponent(query)}&dept=${encodeURIComponent(dept)}&page=${currentPage + 1}`} className="px-4 py-2 bg-gray-200 rounded">
                            Next
                        </a>
                    )}
                </div>
                <ul className="flex flex-wrap gap-4 justify-center">
                    {paginatedAlumni.length > 0 ? (
                        paginatedAlumni.map(person => (
                            <AlumniCard key={person.entryNumber} alumni={person} />
                        ))
                    ) : (
                        <p className="no-results">No Alumni Found</p>
                    )}
                </ul>
                <div className="flex justify-center gap-4 mt-5">
                    {currentPage > 1 && (
                        <a href={`?query=${encodeURIComponent(query)}&dept=${encodeURIComponent(dept)}&page=${currentPage - 1}`} className="px-4 py-2 bg-gray-200 rounded">
                            Previous
                        </a>
                    )}
                    <span className="px-4 py-2 font-semibold">Page {currentPage} of {totalPages}</span>
                    {currentPage < totalPages && (
                        <a href={`?query=${encodeURIComponent(query)}&dept=${encodeURIComponent(dept)}&page=${currentPage + 1}`} className="px-4 py-2 bg-gray-200 rounded">
                            Next
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;