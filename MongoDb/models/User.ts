import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
    universityEmail?: string;
    personalEmail: string;
    password?: string;
    name: string;
    profilePicture?: string;
    provider: "google" | "local";
    createdAt: Date;
}

const UserSchema = new Schema<UserDocument>({
    universityEmail: { type: String, unique: true, sparse: true },
    personalEmail: { type: String, required: false, unique: true },
    password: { type: String, required: function () { return this.provider === "local"; } },
    name: { type: String, required: true },
    profilePicture: { type: String },
    provider: { type: String, required: true, enum: ["google", "local"] },
    createdAt: { type: Date, default: Date.now },
});


const UserModel = (mongoose.models?.User as mongoose.Model<UserDocument>) || mongoose.model<UserDocument>("User", UserSchema);
export default UserModel;
