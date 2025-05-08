import React from "react";
import connectMongo from "@/lib/db";
import EventModel from "@/models/Event";
import Ping from "@/components/utils/Ping";

const View = async ({ id }: { id: string }) => {
    await connectMongo();

    // Fetch event views from MongoDB
    const event = await EventModel.findById(id);
    if (!event) {
        return <p className="error">Event not found</p>;
    }

    const totalViews = event.views;

    // Increment view count
    await EventModel.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return (
        <>
            <div className="flex justify-end items-center mt-5 fixed bottom-3 right-3">
                <div className="absolute -top-2 -right-2">
                    <Ping />
                </div>
                <p className="font-medium text-[16px] bg-amber-200 px-4 py-2 rounded-lg capitalize">
                    <span className="font-black">Views: {totalViews + 1}</span>
                </p>
            </div>
        </>
    );
};

export default View;
