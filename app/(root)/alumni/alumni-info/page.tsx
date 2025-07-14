import React from 'react'
import AlumniInformationForm from "@/components/forms/AlumniInformationForm";
import {auth} from "@/auth";

const Page = async () => {
    const session = await auth();

    return (
        <>
            <section className={"orange_container pattern !min-h-[230px]"}>
                <h1 className={"heading"}>SMVDU (CSE) Alumni Information Update Form </h1>
                <p className={"sub-heading !max-w-3xl"}>STAY CONNECTED WITH SMVDU</p>
            </section>

            <AlumniInformationForm userInfo={session}/>
            </>
    )
}
export default Page
