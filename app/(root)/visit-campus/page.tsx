import Form from "next/form";
import CampusVisitForm from "@/components/CampusVisitForm";

const Page = () => {
  return (
     <>
       <section className={""}>
         <h1 className={"heading"}>For Faculty Guest houses queries, please contact : (email) or call to (phoneno)</h1>
         <h3>Call Back Request or Mail to : (email)</h3>
       </section>
         <CampusVisitForm/>
     </>
  )
}
export default Page
