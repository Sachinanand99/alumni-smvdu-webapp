import { Suspense } from "react";
import connectMongo from "@/lib/mongodb";
import EventModel from "@/MongoDb/models/Event";
import { notFound } from "next/navigation";
import { MapPin, BookText } from "lucide-react";
import markdownIt from "markdown-it";
import View from "@/components/utils/View";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import {format} from "date-fns";

const md = markdownIt();

export const experimental_ppr = true;

const Page = async ({ params }: { params: { id: string } }) => {
  await connectMongo();
  const id = params.id;

  const post = JSON.parse(JSON.stringify(await EventModel.findById(id).sort({ start_date: -1 })));
  if (!post) {
    return notFound();
  }

  const parsedContent = md.render(post?.description || "");

  const eventStatus = (start: Date, end: Date) => {
    const now = new Date();
    return !start || !end
        ? "Invalid Dates"
        : now < start
            ? "Upcoming"
            : now <= end
                ? "Ongoing"
                : "Past Event";
  };

  return (
     <>
       <section className="orange_container pattern !min-h-[230px]">
         <p className="tag tag-tri">{formatDate(post?.start_date)} - { formatDate(post?.end_date)}</p>
         <h1 className="heading">{post.title}</h1>
       </section>

       <main className="max-w-4xl mx-auto my-8 p-4 bg-white border border-gray-200 rounded-lg">
         {/* Event Card */}
         <section id="event-card" className="text-center mb-8 pb-4 border-b border-gray-300">
           <img
              className="mx-auto mb-4 rounded-lg max-w-full h-auto"
              src={post.image}
              alt={post.title}
           />
           <p className="text-base">
             <span className="font-semibold">Date Start:</span> {format(new Date(post.start_date), "PPP")}
           </p>
           <p className="text-base">
             <span className="font-semibold">Date End:</span> {format(new Date(post.end_date), "PPP")} (Indian Standard Time)
           </p>
           <p className="text-base">
             <span className="font-semibold">Status: {eventStatus(new Date(post?.start_date), new Date(post?.end_date))} </span> {post?.status}
           </p>
         </section>

         <section id="event-details">
           <div className="mb-6 p-4 bg-gray-100 rounded-md">
            <span className="inline-flex items-center gap-1">
              <MapPin /> <strong>Address:</strong> {post.location}
            </span>
           </div>
           <div className="p-4 bg-gray-100 rounded-md">
            <span className="inline-flex items-center gap-1">
              <BookText /> <strong>Description:</strong>
            </span>
             {parsedContent ? (
                <article
                   className="mt-4 prose max-w-4xl break-all"
                   dangerouslySetInnerHTML={{ __html: parsedContent }}
                />
             ) : (
                <p className="mt-4">No details provided</p>
             )}
           </div>
         </section>
         <Suspense fallback={<Skeleton className="view_skeleton" />}>
           <View id={id} />
         </Suspense>
       </main>
     </>
  );
};

export default Page;
