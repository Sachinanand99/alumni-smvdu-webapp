import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {Eye} from "lucide-react";
import {formatDate} from "@/lib/utils";
import markdownIt from "markdown-it";

export type EventTypeCard = Event;

const md = markdownIt();

const EventCard = ({ event }: { event: EventTypeCard }) => {

  const parsedContent = md.render(event?.description || "");

  return (
     <li className="home_event-card shadow-orange-200 group">
       <div className="flex justify-between items-center">
         <p className="home_event-card_date">{formatDate(event.start_date)}</p>
         <div className="flex gap-1.5">
          <Eye />
           <span>
          {event.views}
           </span>
         </div>
       </div>
       <div className="flex justify-between mt-5 gap-5">
         <div className="flex-1">
             <h3 className="text-lg font-semibold line-clamp-2">{event.title}</h3>
         </div>
       </div>
         <span className="home_event-card_desc">
           {parsedContent ? (
              <article
                 className="mt-4 prose line-clamp-2"
                 dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
           ) : (
              <p className="mt-4">No details provided</p>
           )}
         </span>
         <img src={event.image} alt="placeholder" className="home_evnet-card_img" />
       <div className="flex-between gap-3 mt-5">
         <Button className="home_event-card_btn" asChild>
           <Link href={`/events/${event._id}`}>
             Details</Link>
         </Button>
       </div>
     </li>
  );
};

export default EventCard;
