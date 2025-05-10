import React from 'react'
import AlumniInformationForm from "@/components/forms/AlumniInformationForm";

const Page = () => {
    return (
        <>
            <section className={"orange_container pattern !min-h-[230px]"}>
                <h1 className={"heading"}>SMVDU (CSE batch) Alumni Information Update Form </h1>
                <p className={"sub-heading !max-w-3xl"}>STAY CONNECTED WITH SMVDU</p>
            </section>
            <AlumniInformationForm/>
            </>
    )
}
export default Page
