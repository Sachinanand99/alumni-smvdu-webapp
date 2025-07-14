import mongoose, { Schema, Document } from "mongoose";

export interface GalleryDocument extends Document {
    eventId: string;
    url: string;
    caption?: string;
}

const GallerySchema = new Schema<GalleryDocument>({
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    url: { type: String, required: true },
    caption: { type: String },
}, { timestamps: true });

const GalleryModel = mongoose.models.Gallery || mongoose.model<GalleryDocument>("Gallery", GallerySchema);

export default GalleryModel;
