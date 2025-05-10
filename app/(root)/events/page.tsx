import React from "react";

import EventCard, { EventTypeCard } from "@/components/cards/EventCard";
import EventFilter from "@/components/utils/EventFilter";
import connectMongo from "@/lib/mongodb";
import EventModel from "@/MongoDb/models/Event";

const Page = async ({ searchParams }: { searchParams: { query?: string; cat?: string } }) => {
  await connectMongo();

  const query = searchParams.query || "";
  const category = searchParams.cat || "all";

  const filter: any = {};

  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }

  if (category && category !== "all") {
    const now = new Date();
    if (category === "upcoming") filter.start_date = { $gt: now };
    if (category === "ongoing") {
      filter.$and = [{ start_date: { $lte: now } }, { end_date: { $gte: now } }];
    }
    if (category === "past") filter.end_date = { $lt: now };
  }

  const events = await EventModel.find(filter).sort({ start_date: -1 });
  const allEvents = await EventModel.find({}).sort({ start_date: -1 });

  return (
      <>
        <div className="flex gap-x-3 p-5">
          <EventFilter query={query} events={allEvents} />
          <ul className="flex flex-col flex-1 basis-[70%]">
            {events.length > 0 ? (
                events.map((post: EventTypeCard) => <EventCard key={post._id} event={post} />)
            ) : (
                <p className="no-results">No Events found</p>
            )}
          </ul>
        </div>
      </>
  );
};

export default Page;
