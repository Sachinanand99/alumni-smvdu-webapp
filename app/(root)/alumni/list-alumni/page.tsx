import React from "react";
import AlumniCard, { AlumniTypeCard } from "@/components/cards/AlumniCard";
import AlumniFilter from "@/components/utils/AlumniFilter";
import connectMongo from "@/lib/mongodb";
import AlumniModel from "@/MongoDb/models/Alumni";

const Page = async ({ searchParams }: { searchParams: { query?: string; dept?: string } }) => {
    await connectMongo();

    const query = searchParams.query || "";
    const department = searchParams.dept || "all";

    const filter: any = {   };

    if (query) {
        filter.name = { $regex: query, $options: "i" };
    }

    if (department && department !== "all") {
        filter.department = department;
    }

    const alumni = await AlumniModel.find(filter).sort({ graduation_year: -1 });
    const allAlumni = await AlumniModel.find({}).sort({ graduation_year: -1 });

    return (
        <>
            <div className="flex gap-x-3 p-5">
                <AlumniFilter query={query} alumni={allAlumni} />
                <ul className="flex flex-col flex-1 basis-[70%]">
                    {alumni.length > 0 ? (
                        alumni.map((person: AlumniTypeCard) => <AlumniCard key={person._id} alumni={person} />)
                    ) : (
                        <p className="no-results">No Alumni Found</p>
                    )}
                </ul>
            </div>
        </>
    );
};

export default Page;