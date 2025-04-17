import React from 'react'
import EventCard, {EventTypeCard} from "@/components/EventCard";
import EventFilter from "@/components/EventFilter";
import {sanityFetch, SanityLive} from "@/sanity/lib/live";
import {EVENT_QUERY, EVENT_QUERY_ALL} from "@/sanity/lib/query";


const Page = async ({ searchParams }: { searchParams: Promise<{ query: string; cat: string }> }) => {
  const { query, cat } = await searchParams;

  const params = {
    search: query || null,
    category: cat || "all",
  };

  const { data: events } = await sanityFetch({
    query: EVENT_QUERY,
    params,
  });

  const {data: allEvents} = await sanityFetch({
    query: EVENT_QUERY_ALL,
    params,
  })

  return (
     <>
       <div className="flex gap-x-3 p-5">
         <EventFilter query={query} events ={allEvents}/>
         <ul className="flex flex-col flex-1 basis-[70%]">
           {events?.length > 0 ? (
              events.map((post: EventTypeCard) => (
                 <EventCard key={post?._id} event = {post}  />
              ))
           ) : (
              <p className="no-results">No Events found</p>
           )}
         </ul>
       </div>
       <SanityLive/>
     </>
  )
}
export default Page
