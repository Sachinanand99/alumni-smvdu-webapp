import React from "react";
import Footer from "@/components/Footer";
import HomeEventCard from "@/components/cards/HomeEventCard";
import ContactMap from "@/components/utils/ContactMap";
import ContactCard from "@/components/cards/ContactCard";
import EventModel from "@/models/Event";
import connectMongo from "@/lib/db";

export default async function Home({ searchParams }: { searchParams: { query?: string; cat?: string } }) {
    await connectMongo();
    const filter: any = {};

    const events = await EventModel.find(filter).sort({ start_date: -1 });

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
                    Explore the achievements of CSE alumni, build meaningful connections within the tech community, and contribute to the innovation and growth of the CSE network.
                </p>
            </section>

            <section className="px-6 py-10 max-w-7xl mx-auto">
                <p className="font-semibold text-[30px] text-black">Events</p>
                <ul className="mt-7 grid md:grid-cols-3 sm:grid-cols-2 gap-5">
                    {events?.length > 0 ? (
                        events.slice(0, 6).map((post) => <HomeEventCard key={post._id} event={post} />)
                    ) : (
                        <p className="no-results">No Events found</p>
                    )}
                </ul>
            </section>

            <section>alumni cards</section>

            <section className="px-6 py-10 max-w-7xl mx-auto" id="contact">
                <p className="font-semibold text-[30px] text-black">Contact Us</p>
                <div className="flex py-5 gap-3 justify-items-start flex-wrap">
                    <ContactCard />
                    <ContactMap apiKey={apiKey} latitude={latitude} longitude={longitude} />
                </div>
            </section>

            <Footer />
        </>
    );
}
