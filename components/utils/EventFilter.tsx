"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SearchFormReset from "./SearchFormReset";
import Form from "next/form";
import {eventStatus} from "@/lib/utils";
import {EventTypeCard} from "@/components/cards/EventCard";

const EventFilter = ({ query, events }: { query?: string, events?: EventTypeCard }) => {
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  function selectAll() {
    setFilter("all");
    router.push(`/events?query=${query || ""}&cat=all`);
  }

  function selectPast() {
    setFilter("past");
    router.push(`/events?query=${query || ""}&cat=past`);
  }

  function selectUpcoming() {
    setFilter("upcoming");
    router.push(`/events?query=${query || ""}&cat=upcoming`);
  }

  function selectOngoing(){
    setFilter("ongoing");
    router.push(`/events?query=${query || ""}&cat=ongoing`);
  }

  function getEventCounts(events: EventTypeCard[]) {
    const counts = { upcoming: 0, ongoing: 0, past: 0 };

    events.forEach(({ start_date, end_date }) => {
      const status = eventStatus(new Date(start_date), new Date(end_date));
      if (status === 2) counts.upcoming++;
      else if (status === 1) counts.ongoing++;
      else if (status === 0) counts.past++;
    });

    return counts;
  }

  const {upcoming, ongoing, past}:{upcoming: number, ongoing: number, past: number}= getEventCounts(events);

  return (
     <div className="basis-[25%] mt-4 ml-4">
       <Form action="/events" scroll={false} className="flex flex-1 max-w-sm space-x-2 search-form">
         <Input
            name="query"
            defaultValue={query}
            className="bg-white"
            placeholder="Search Events by Title..."
         />
         <div className="flex gap-2">
           {query && <SearchFormReset />}
           <Button type="submit" className="text-white cursor-pointer">
             <Search className="size-5" />
           </Button>
         </div>
       </Form>

       <div className="flex flex-col gap-y-2 mt-3 text-color-black">
         <span className="font-semibold">EVENT CATEGORIES</span>

         <div
            className={`cursor-pointer h-[2.5rem] flex justify-between items-center px-2 border-l-4 ${
               filter === "all" ? "bg-[#f0f0f0] border-[#71B340] rounded-sm" : "bg-[#DFDFDF] hover:bg-[#71B340] hover:border-[#71B340] rounded-sm"
            }`}
            onClick={selectAll}
         >
           <span>All Events</span>
           <span>({upcoming+ongoing+past})</span>
         </div>

         <div
            className={`cursor-pointer h-[2.5rem] flex justify-between items-center px-2 border-l-4 ${
               filter === "ongoing" ? "bg-[#f0f0f0] border-[#71B340] rounded-sm" : "bg-[#DFDFDF] hover:bg-[#71B340] hover:border-[#71B340] rounded-sm"
            }`}
            onClick={selectOngoing}
         >
           <span>Ongoing Events</span>
           <span>({ongoing})</span>
         </div>

         <div
            className={`cursor-pointer h-[2.5rem] flex justify-between items-center px-2 border-l-4 ${
               filter === "past" ? "bg-[#f0f0f0] border-[#71B340] rounded-sm" : "bg-[#DFDFDF] hover:bg-[#71B340] hover:border-[#71B340] rounded-sm"
            }`}
            onClick={selectPast}
         >
           <span>Past Events</span>
           <span>({past})</span>
         </div>

         <div
            className={`cursor-pointer h-[2.5rem] flex justify-between items-center px-2 border-l-4 ${
               filter === "upcoming" ? "bg-[#f0f0f0] border-[#71B340] rounded-sm" : "bg-[#DFDFDF] hover:bg-[#71B340] hover:border-[#71B340] rounded-sm"
            }`}
            onClick={selectUpcoming}
         >
           <span>Upcoming Events</span>
           <span>({upcoming})</span>
         </div>
       </div>
     </div>
  );
};

export default EventFilter;
