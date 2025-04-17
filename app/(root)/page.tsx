import Footer from "@/components/Footer";
import React from "react";
import {sanityFetch, SanityLive} from "@/sanity/lib/live";
import {EVENT_QUERY} from "@/sanity/lib/query";
import {EventTypeCard} from "@/components/EventCard";
import HomeEventCard from "@/components/HomeEventCard";
import ContactMap from "@/components/ContactMap";
import ContactCard from "@/components/ContactCard";


export default async function Home({searchParams,}: {
  searchParams: Promise<{ query: string, cat: string }>;
}) {
  const { query, cat } = await searchParams;

  const params = {
    search: query || null,
    category: cat || "all",
  };

  const { data : events } = await sanityFetch({query: EVENT_QUERY, params });

  const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
  return (
     <>
       <section className="pink_container pattern">
         <h1 className="heading">
           Connect with CSE Alumni,<br/> Empower Your Future
         </h1>

         <p className="sub-heading !max-w-3xl">
           Explore the achievements of CSE alumni, build meaningful connections within the tech community, and contribute to the innovation and growth of the CSE network
         </p>
       </section>


       <section className="px-6 py-10 max-w-7xl mx-auto">
         <p  className="font-semibold text-[30px] text-black">
           Events
           </p>
         <ul className="mt-7 grid md:grid-cols-3 sm:grid-cols-2 gap-5">
           {events?.length > 0 ? (
              events.slice(0, 6).map((post: EventTypeCard) => (
                 <HomeEventCard key={post?._id} event={post} />
              ))
           ) : (
              <p className="no-results">No Events found</p>
           )}
         </ul>
       </section>

       <section>
       alumni cards
       </section>

       <section className="px-6 py-10 max-w-7xl mx-auto" id="contact">
         <p  className="font-semibold text-[30px] text-black">
           Contact Us
         </p>
         <div className="flex py-5 gap-3 justify-items-start flex-wrap ">
           <ContactCard/>
           <ContactMap apiKey={MAPBOX_API_KEY} />
         </div>
       </section>
         <Footer/>
       <SanityLive/>
     </>
  );
}
