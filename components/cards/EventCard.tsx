import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import ShareModal from "../utils/ShareModal";
import { format } from "date-fns";
import {EventDocument} from "@/MongoDb/models/Event";
import Image from "next/image";


const EventCard = ({ event }: { event: EventDocument }) => {
  const shareUrl = process.env.NEXT_PUBLIC_BASE_URL + "/events/" + event._id;

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
      <li className="flex flex-col md:flex-row gap-4 w-full   rounded-lg border-[2px] border-grey hover:border-primary transition-all p-4 m-4 bg-white shadow-sm">
        <div className="relative w-full md:w-64 h-56 md:h-64 flex-shrink-0">
          <Link href={`/events/${event._id}`}>
            <Image
                src={event.image}
                alt="event-image"
                fill
                className="rounded-md object-cover"
                priority
            />
          </Link>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-lg font-semibold text-gray-800 gap-2">
              <span className="line-clamp-2">{event.title}</span>
              <ShareModal eventUrl={shareUrl} />
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-700">
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

          <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2 gap-2">
            <Button disabled variant="outline" className={`${buttonStyles} w-full sm:w-auto`}>
              {status}
            </Button>
            <Button className="w-full sm:w-auto">
              <Link href={`/events/${event._id}`}>View</Link>
            </Button>
          </div>
        </div>
      </li>
  );
};

export default EventCard;
