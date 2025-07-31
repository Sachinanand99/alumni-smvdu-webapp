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
    const excelData = await readXlsxData(["fullName", "entryNumber", "companyOrInstitute", "professionalSector", "profilePicture"]);
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
                profilePicture: entry.profilePicture?.trim()
                    ? entry.profilePicture
                    : matchingMongoEntry?.profilePicture || null,
                companyOrInstitute: entry.companyOrInstitute ? [entry.companyOrInstitute.trim()] : [],
                professionalSector: entry.professionalSector ? [entry.professionalSector.trim()] : []
            });
        }
    });

    return Array.from(alumniMap.values());
}

const Page = async ({ searchParams }: { searchParams: { query?: string; dept?: string; page?: string } }) => {
    const { query = "", dept = "all", page = "1" } = await searchParams;
    const currentPage = parseInt(page, 10) || 1;
    const pageSize = 50;

    const allAlumni = await getMergedData();

    const filteredAlumni = allAlumni.filter(person => {
        const matchesQuery = query
            ? person.fullName?.toLowerCase().includes(query.toLowerCase())
            : true;

        const matchesDepartment = dept !== "all"
            ? person.department === dept
            : true;

        return matchesQuery && matchesDepartment;
    });

    const totalPages = Math.ceil(filteredAlumni.length / pageSize);
    const paginatedAlumni = filteredAlumni.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
            <div className="w-full lg:max-w-xs">
                <AlumniFilter query={query} alumni={allAlumni} />
            </div>

            <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-2">
                    {currentPage > 1 && (
                        <a
                            href={`?query=${encodeURIComponent(query)}&dept=${encodeURIComponent(dept)}&page=${currentPage - 1}`}
                            className="px-4 py-2 bg-gray-200 rounded text-sm"
                        >
                            Previous
                        </a>
                    )}
                    <span className="px-4 py-2 font-semibold text-sm">
            Page {currentPage} of {totalPages}
          </span>
                    {currentPage < totalPages && (
                        <a
                            href={`?query=${encodeURIComponent(query)}&dept=${encodeURIComponent(dept)}&page=${currentPage + 1}`}
                            className="px-4 py-2 bg-gray-200 rounded text-sm"
                        >
                            Next
                        </a>
                    )}
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mt-6">
                    {paginatedAlumni.length > 0 ? (
                        paginatedAlumni.map(person => (
                            <AlumniCard key={person.entryNumber || person.fullName} alumni={person} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No Alumni Found</p>
                    )}
                </ul>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                    {currentPage > 1 && (
                        <a
                            href={`?query=${encodeURIComponent(query)}&dept=${encodeURIComponent(dept)}&page=${currentPage - 1}`}
                            className="px-4 py-2 bg-gray-200 rounded text-sm"
                        >
                            Previous
                        </a>
                    )}
                    <span className="px-4 py-2 font-semibold text-sm">
            Page {currentPage} of {totalPages}
          </span>
                    {currentPage < totalPages && (
                        <a
                            href={`?query=${encodeURIComponent(query)}&dept=${encodeURIComponent(dept)}&page=${currentPage + 1}`}
                            className="px-4 py-2 bg-gray-200 rounded text-sm"
                        >
                            Next
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;
;