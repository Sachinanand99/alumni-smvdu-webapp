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

EventSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("title") || this.isModified("start_date") || this.isModified("end_date")) {
        this.slug = `${this.title.toLowerCase().replace(/\s+/g, '-')}-${this.start_date.getFullYear()}`;
    }
    next();
});

const EventModel = mongoose.models.Event || mongoose.model<EventDocument>("Event", EventSchema);

export default EventModel;
