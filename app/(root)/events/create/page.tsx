// import { auth } from "@/auth";
import StartupForm from "@/components/EventForm";
import EventForm from "@/components/EventForm";
// import {redirect} from "next/navigation";

const Page = async () => {
  // const session = await auth();
  //
  // if (!session) {
  //   redirect('/');
  // }
  //   todo

  return (
     <>
       <section className="!min-h-[230px]">
         <h1 className="heading">Create Event</h1>
       </section>

       <EventForm/>
     </>
  )
}
export default Page
