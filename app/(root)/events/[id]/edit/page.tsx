import React from 'react';
import UpdateEventForm from "@/components/forms/UpdateEventForm";

const Page = async ({ params }: { params: { id: string } }) => {
    const {id} = await params;
    return (
        <>
            <section className="orange_container pattern !min-h-[230px]">
                <h1 className="heading">Update Event</h1>
            </section>

            <UpdateEventForm eventId={id} />
        </>
    );
};

export default Page;
