import mongoose, { Schema, Document } from "mongoose";

export interface EventDocument extends Document {
    title: string;
    slug: string;
    start_date: Date;
    end_date: Date;
    location: string;
    image: string;
    attendees: number;
    views: number;
    description: string;
}

const EventSchema = new Schema<EventDocument>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    attendees: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    description: { type: String, required: true },
});

const EventModel = mongoose.models.Event || mongoose.model<EventDocument>("Event", EventSchema);

export default EventModel;
