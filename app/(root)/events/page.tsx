import React from "react";

import EventCard from "@/components/cards/EventCard";
import EventFilter from "@/components/utils/EventFilter";
import connectMongo from "@/lib/mongodb";
import EventModel, {EventDocument} from "@/MongoDb/models/Event";

const Page = async ({ searchParams }: { searchParams: { query?: string; cat?: string } }) => {
  await connectMongo();
  const {query, cat} = await searchParams;
  const q = query || "";
  const category = cat || "all";

  const filter: any = {};

  if (q) {
    filter.title = { $regex: q, $options: "i" };
  }

  if (category && category !== "all") {
    const now = new Date();
    if (category === "upcoming") filter.start_date = { $gt: now };
    if (category === "ongoing") {
      filter.$and = [{ start_date: { $lte: now } }, { end_date: { $gte: now } }];
    }
    if (category === "past") filter.end_date = { $lt: now };
  }

  const events = JSON.parse(JSON.stringify(await EventModel.find(filter).sort({ start_date: -1 })));
  const allEvents = JSON.parse(JSON.stringify(await EventModel.find({}).sort({ start_date: -1 })));

  return (
      <>
        <div className="flex gap-x-3 p-5">
          <EventFilter query={q} events={allEvents} />
          <ul className="flex flex-col flex-1 basis-[70%]">
            {events.length > 0 ? (
                events.map((post: EventDocument) => <EventCard key={post._id} event={post} />)
            ) : (
                <p className="no-results">No Events found</p>
            )}
          </ul>
        </div>
      </>
  );
};

export default Page;
