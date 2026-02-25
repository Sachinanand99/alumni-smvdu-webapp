import mongoose from "mongoose";

const MONGODB_URI:string|undefined = process.env.MONGODB_URI;

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log(error);
    }
};

export default connectDB;