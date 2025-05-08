import mongoose, { Schema, Document } from "mongoose";

export interface CampusVisitDocument extends Document {
    name: string;
    email: string;
    phone: string;
    batch: string;
    description: string;
    createdAt: Date;
}

const CampusVisitSchema = new Schema<CampusVisitDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    batch: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const CampusVisitModel = mongoose.models.CampusVisit || mongoose.model<CampusVisitDocument>("CampusVisit", CampusVisitSchema);

export default CampusVisitModel;
