import React from 'react'
import AlumniCard, {AlumniTypeCard} from "@/components/AlumniCard";
import AlumniFilter from "@/components/AlumniFilter";
import {sanityFetch, SanityLive} from "@/sanity/lib/live";
import {EVENT_QUERY, EVENT_QUERY_ALL} from "@/sanity/lib/query";

// todo

const Page = async ({ searchParams }: { searchParams: Promise<{ query: string; cat: string }> }) => {
  return (
      <>
        <div className="flex gap-x-3 p-5">
          {/*<AlumniFilter alumnis={allAlumnis}/>*/}
        {/*  <ul className="flex flex-col flex-1 basis-[70%]">*/}
        {/*    {alumnis?.length > 0 ? (*/}
        {/*        alumnis.map((post: AlumniTypeCard) => (*/}
        {/*            <AlumniCard key={post?._id} event={post}/>*/}
        {/*        ))*/}
        {/*    ) : (*/}
        {/*        <p className="no-results">No Alumni&apos;s found</p>*/}
        {/*    )}*/}
        {/*  </ul>*/}
            TODO: Alumni Data Needs to be upload at Sanity
        </div>
        {/*<SanityLive/>*/}
`      </>
  )
}
export default Page
