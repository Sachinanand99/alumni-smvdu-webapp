import React from 'react'
import {Eye} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { EVENT_VIEWS_QUERY } from "@/sanity/lib/query";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";
import Ping from "@/components/Ping";


const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
     .withConfig({ useCdn: false })
     .fetch(EVENT_VIEWS_QUERY, { id });

  after(
     async () =>
        await writeClient
           .patch(id)
           .set({ views: totalViews + 1 })
           .commit(),
  );  return (
     <>
       <div className="flex justify-end items-center mt-5 fixed bottom-3 right-3">
         <div className="absolute -top-2 -right-2">
           <Ping />
         </div>

         <p className="font-medium text-[16px] bg-amber-200 px-4 py-2 rounded-lg capitalize">
           <span className="font-black">Views: {totalViews}</span>
         </p>
       </div>
     </>
  )
}
export default View
