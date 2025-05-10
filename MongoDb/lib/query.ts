import EventModel from "@/MongoDb/models/Event";
import connectMongo from "@/lib/mongodb";

export const EVENT_QUERY = async ({ search, category }: { search?: string; category?: string }) => {
    await connectMongo();

    const filter: any = {};

    if (search) {
        filter.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
        const now = new Date();
        if (category === "upcoming") filter.start_date = { $gt: now };
        if (category === "ongoing") filter.start_date = { $lte: now, end_date: { $gte: now } };
        if (category === "past") filter.end_date = { $lt: now };
    }

    return EventModel.find(filter).sort({ start_date: -1 }).select("attendees location start_date end_date image title _id description views");
};


export const EVENT_QUERY_ALL = async ({ search }: { search?: string }) => {
    await connectMongo();

    const filter: any = {};

    if (search) {
        filter.title = { $regex: search, $options: "i" };
    }

    return EventModel.find(filter).sort({ start_date: -1 }).select("start_date end_date");
};

export const EVENT_QUERY_BY_ID = async ({ id }: { id: string }) => {
    await connectMongo();
    return EventModel.findById(id).select("attendees location start_date end_date image title _id views description");
};

export const EVENT_VIEWS_QUERY = async ({ id }: { id: string }) => {
    await connectMongo();
    return EventModel.findById(id).select("_id views");
};

