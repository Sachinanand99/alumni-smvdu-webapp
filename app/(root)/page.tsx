import React from "react";
import Footer from "@/components/Footer";
import HomeEventCard from "@/components/cards/HomeEventCard";
import AlumniCard from "@/components/cards/AlumniCard";
import ContactMap from "@/components/utils/ContactMap";
import ContactCard from "@/components/cards/ContactCard";
import EventModel from "@/MongoDb/models/Event";
import connectMongo from "@/lib/mongodb";
import readXlsxData from "@/lib/excel";

export default async function Home({
                                       searchParams,
                                   }: {
    searchParams: { query?: string; cat?: string };
}) {
    await connectMongo();

    const events = await EventModel.find({}).sort({ start_date: -1 });

    const rawData = await readXlsxData([
        "fullName",
        "entryNumber",
        "companyOrInstitute",
        "professionalSector",
        "department",
        "profilePicture",
    ]);

    const alumniMap = new Map();

    rawData.forEach((entry) => {
        const entryNumber = entry.entryNumber?.trim();
        if (!entry.fullName || !entryNumber) return;

        const normalizedCompany = typeof entry.companyOrInstitute === "string"
            ? entry.companyOrInstitute.trim()
            : null;
        const normalizedSector = typeof entry.professionalSector === "string"
            ? entry.professionalSector.trim()
            : null;

        const key = entryNumber;
        const existing = alumniMap.get(key);

        if (existing) {
            if (
                normalizedCompany &&
                !existing.companyOrInstitute.includes(normalizedCompany)
            ) {
                existing.companyOrInstitute.push(normalizedCompany);
            }
            if (
                normalizedSector &&
                !existing.professionalSector.includes(normalizedSector)
            ) {
                existing.professionalSector.push(normalizedSector);
            }
        } else {
            alumniMap.set(key, {
                fullName: entry.fullName.trim(),
                entryNumber,
                department: entry.department || "",
                profilePicture:
                    typeof entry.profilePicture === "string"
                        ? entry.profilePicture
                        : null,
                universityEmail: `${entryNumber}@smvdu.ac.in`,
                companyOrInstitute: normalizedCompany ? [normalizedCompany] : [],
                professionalSector: normalizedSector ? [normalizedSector] : [],
            });
        }
    });

    const mergedAlumni = Array.from(alumniMap.values())
        .map((alum) => ({
            ...alum,
            companyOrInstitute: alum.companyOrInstitute.join(", "),
            professionalSector: alum.professionalSector.join(", "),
        }))
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);

    const apiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    const latitude = 32.9421;
    const longitude = 74.9541;

    return (
        <>
            <section className="orange_container pattern">
                <h1 className="heading">
                    Connect with CSE Alumni,<br /> Empower Your Future
                </h1>
                <p className="sub-heading !max-w-3xl">
                    Explore the achievements of CSE alumni, build meaningful connections
                    within the tech community, and contribute to the innovation and
                    growth of the CSE network.
                </p>
            </section>

            <section className="px-6 py-10 max-w-7xl mx-auto">
                <p className="font-semibold text-[30px] text-black">Events</p>
                <ul className="mt-7 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5">
                    {events.length > 0 ? (
                        events.slice(0, 6).map((event) => (
                            <HomeEventCard key={event._id.toString()} event={event} />
                        ))
                    ) : (
                        <p className="no-results">No Events Found...</p>
                    )}
                </ul>
            </section>

            <section className="px-6 py-10 max-w-7xl mx-auto">
                <p className="font-semibold text-[30px] text-black">Alumni</p>
                <ul className="mt-7 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5">
                    {mergedAlumni.length > 0 ? (
                        mergedAlumni.map((person, idx) => (
                            <AlumniCard
                                key={`${person.entryNumber}-${idx}`}
                                alumni={person}
                            />
                        ))
                    ) : (
                        <p className="no-results">No Alumni Found...</p>
                    )}
                </ul>
            </section>

            <section className="px-6 py-10 max-w-7xl mx-auto" id="contact">
                <p className="font-semibold text-[30px] text-black">Contact Us</p>
                <div className="flex py-5 gap-3 justify-evenly flex-wrap">
                    <ContactCard />
                    <ContactMap
                        apiKey={apiKey}
                        latitude={latitude}
                        longitude={longitude}
                    />
                </div>
            </section>

            <Footer />
        </>
    );
}
