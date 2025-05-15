import React from 'react'
import {Phone, Mail, Facebook} from 'lucide-react';
import Link from "next/link";

const ContactCard = () => {
  const ContactCardPhone = process.env.ContactCardPhone || "N/A";
  const ContactCardMail = process.env.ContactCardMail || "N/A";

  return (
     <div className="home_contact-card ">
       <div>
       <h3 className="text-lg font-semibold line-clamp-2 py-3">Contact Info</h3>
         <article>Shri Mata Vaishno Devi University Campus, <br/>
           Sub-Post Office, Katra, <br/>
           Jammu and Kashmir – 182320
         </article>
         <div className="flex flex-col justify-start py-3 gap-y-1">
           <div className="flex">
             <Phone/>&nbsp; : {ContactCardPhone}
           </div>
           <div className="flex">
             <Mail/> &nbsp;: {ContactCardMail}
           </div>
         </div>
         <div className="flex gap-x-2 py-3">
           <Link href="https://www.facebook.com/SMVDUniversity/">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512"><path fill="#1e88e5" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"/></svg>
           </Link>
           <Link href="https://www.linkedin.com/school/shri-mata-vaishno-devi-university">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 448 512"><path fill="#1565c0" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>
           </Link>
           <Link href="https://twitter.com/smvduofficial">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512"><path fill="#000000" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
           </Link>
           <Link href="https://www.youtube.com/SMVDUniversity">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 576 512"><path fill="#cd201f" d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>
           </Link>
           </div>
       </div>
     </div>
  )
}
export default ContactCard
