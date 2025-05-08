import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

let cached = global.mongoose || { conn: null, promise: null };

const connectMongo = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((mongoose) => {
            console.log("MongoDB Connected");
            return mongoose;
        }).catch((err) => {
            console.error("MongoDB Connection Error:", err);
            throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

global.mongoose = cached;

export default connectMongo;
