import EventForm from "@/components/forms/EventForm";

const Page = async () => {

  //   admin only
  return (
     <>
       <section className="orange_container pattern !min-h-[230px]">
         <h1 className="heading">Create Event</h1>
       </section>

       <EventForm/>
     </>
  )
}
export default Page
