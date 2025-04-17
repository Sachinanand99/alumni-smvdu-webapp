import EventCard, {EventTypeCard} from "@/components/EventCard";
import AlumniFilters from "@/components/EventFilter";
import {sanityFetch} from "@/sanity/lib/live";
import {EVENT_QUERY} from "@/sanity/lib/query";

const Page = async () => {

  const { data : events } = await sanityFetch({query: EVENT_QUERY });
  return (
     <>
       <div className="flex gap-x-3">
         <AlumniFilters/>
         <ul>
           {events?.length > 0 ? (
              events.map((post: EventTypeCard) => (
                 <EventCard key={post?._id} event = {post}  />
              ))
           ) : (
              <p className="no-results">No Events found</p>
           )}
         </ul>
       </div>
     </>
  )
}
export default Page
