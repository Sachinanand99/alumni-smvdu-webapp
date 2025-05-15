import Form from "next/form";
import CampusVisitForm from "@/components/forms/CampusVisitForm";

const Page = () => {

    const contactEmail = process.env.REACT_APP_CONTACT_EMAIL || "N/A";
    const contactPhone = process.env.REACT_APP_CONTACT_PHONE  || "N/A";

    return (

     //  logged in users can fill this form.

     <>
       <section className={"orange_container pattern !min-h-[230px]"}>
         <h1 className={"heading"}>Campus Visit Form</h1>
         <p className={"sub-heading !max-w-3xl"}>For Faculty Guest houses queries, please contact : <br/>{contactEmail} or call to {contactPhone}</p>
       </section>
         <CampusVisitForm/>
     </>
  )
}
export default Page
