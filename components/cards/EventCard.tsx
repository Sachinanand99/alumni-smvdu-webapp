import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import ShareModal from "../utils/ShareModal";
import { format } from "date-fns";
import {EventDocument} from "@/MongoDb/models/Event";


const EventCard = ({ event }: { event: EventDocument }) => {
  const shareUrl = process.env.SITEURL + "/events/" + event._id;

  const now = new Date();
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  let status = "Past event";
  let buttonStyles = "bg-gray-200 text-gray-500 cursor-not-allowed";

  if (now < startDate) {
    status = "Upcoming event";
    buttonStyles = "bg-green-200 text-green-700";
  } else if (now >= startDate && now <= endDate) {
    status = "Ongoing event";
    buttonStyles = "bg-orange-200 text-orange-700";
  }

  return (
     <li className="flex flex-col md:flex-row gap-4 w-100% border border-gray-300 rounded-lg p-4 m-4 bg-white shadow-sm">
       <div className="w-64 h-64 flex-shrink-0">
         <Link href={`/events/${event._id}`}>
           <img
              src={event.image}
              alt="event-image"
              className="w-full h-full object-cover rounded-md"
           />
         </Link>
       </div>

       <div className="flex flex-col justify-between flex-1">
         <div>
           <div className="flex items-center justify-between text-lg font-semibold text-gray-800">
             <span className="line-clamp-2">{event.title}</span>
             <ShareModal eventUrl={`${shareUrl}`} />
           </div>

           <div className="mt-6 space-y-1 text-sm text-gray-700">
             <div className="flex items-center space-x-2">
               <Clock className="w-4 h-4" />
               <span>Starts: {format(new Date(event.start_date), "PPP")}</span>
             </div>
             <div className="flex items-center space-x-2">
               <Clock className="w-4 h-4" />
               <span>Ends: {format(new Date(event.end_date), "PPP")}</span>
             </div>
             <div className="flex items-center space-x-2">
               <MapPin className="w-4 h-4" />
               <span>Location: {event.location}</span>
             </div>
           </div>
         </div>

         <div className="mt-4 flex space-x-2">
           <Button disabled variant="outline" className={buttonStyles}>
             {status}
           </Button>
           <Button>
             <Link href={`/events/${event._id}`}>View</Link>
           </Button>
         </div>
       </div>
     </li>
  );
};

export default EventCard;
