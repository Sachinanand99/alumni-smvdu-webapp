"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import EventSearchFormReset from "./EventSearchFormReset";
import Form from "next/form";
import {eventStatus} from "@/lib/utils";
import {EventDocument} from "@/MongoDb/models/Event";

const EventFilter = ({ query, events }: { query?: string, events?: EventDocument }) => {
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  function handleFilterChange(selected: string) {
    setFilter(selected);
    router.push(`/events?query=${query || ""}&cat=${selected}`);
  }

  function getEventCounts(events: EventDocument[]) {
    const counts = { upcoming: 0, ongoing: 0, past: 0 };
    events.forEach(({ start_date, end_date }) => {
      const status = eventStatus(new Date(start_date), new Date(end_date));
      if (status === 2) counts.upcoming++;
      else if (status === 1) counts.ongoing++;
      else if (status === 0) counts.past++;
    });
    return counts;
  }

  const { upcoming, ongoing, past } = getEventCounts(events);

  return (
      <div className="flex-grow lg:flex-grow-0 w-full lg:w-full h-full px-4 lg:px-0">
       <div className={"flex justify-center lg:justify-start"}>
        <Form action="/events" scroll={false} className="flex flex-1 max-w-sm space-x-2 search-form">
         <Input
            name="query"
            defaultValue={query}
            className="bg-white "
            placeholder="Search Events by Title..."
         />
         <div className="flex gap-2">
           {query && <EventSearchFormReset />}
           <Button type="submit" className="text-white cursor-pointer">
             <Search className="size-5" />
           </Button>
         </div>
       </Form>
       </div>

        {/* Mobile & Tablet Filter (dropdown) */}
        <div className="block lg:hidden mt-4">
          <label className="block mb-1 font-semibold">Filter Events</label>
          <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full p-2 rounded-sm bg-white text-black !border-[1px] form_input  !py-3 !mx-3"
          >
            <option value="all">All Events ({upcoming + ongoing + past})</option>
            <option value="ongoing">Ongoing Events ({ongoing})</option>
            <option value="past">Past Events ({past})</option>
            <option value="upcoming">Upcoming Events ({upcoming})</option>
          </select>
        </div>

        {/* Desktop Filter (styled list) */}
        <div className="hidden lg:block mt-3">
          <div className="flex flex-col gap-y-2 text-color-black">
            <span className="font-semibold">EVENT CATEGORIES</span>

            {[
              { label: "All Events", key: "all", count: upcoming + ongoing + past },
              { label: "Ongoing Events", key: "ongoing", count: ongoing },
              { label: "Past Events", key: "past", count: past },
              { label: "Upcoming Events", key: "upcoming", count: upcoming }
            ].map(({ label, key, count }) => (
                <div
                    key={key}
                    className={`cursor-pointer h-[2.5rem] flex justify-between items-center px-2 border-l-4 ${
                        filter === key
                            ? "bg-[#f0f0f0] border-[#71B340] rounded-sm"
                            : "bg-[#DFDFDF] hover:bg-[#71B340] hover:border-[#71B340] rounded-sm"
                    }`}
                    onClick={() => handleFilterChange(key)}
                >
                  <span>{label}</span>
                  <span>({count})</span>
                </div>
            ))}
          </div>
     </div></div>
  );
};

export default EventFilter;
