import mongoose, { Schema, Document } from "mongoose";

export interface AlumniDocument extends Document {
    fullName: string;
    email: string;
    phone?: string;
    entryNumber: string;
    department: string;
    degree: string[];
    professionalSector?: string;
    countryOfResidence: string;
    postalAddress?: string;
    linkedinProfile?: string;
    companyOrInstitute: string;
    createdAt: Date;
}

const AlumniSchema = new Schema<AlumniDocument>({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    entryNumber: { type: String, required: true },
    department: { type: String, required: true },
    degree: { type: [String], required: true },
    professionalSector: { type: String },
    countryOfResidence: { type: String, required: true },
    postalAddress: { type: String },
    linkedinProfile: { type: String },
    companyOrInstitute: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Alumni = mongoose.models.Alumni || mongoose.model<AlumniDocument>("Alumni", AlumniSchema);

export default Alumni;
