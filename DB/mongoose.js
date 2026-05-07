import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongooseCache = globalThis.__mongooseCache || {
    connection: null,
    connectionPromise: null,
};

globalThis.__mongooseCache = mongooseCache;

const connectDB = async () => {
    try {
        if (mongooseCache.connection && mongoose.connection.readyState === 1) {
            return mongooseCache.connection;
        }

        if (!process.env.DB_URL) {
            throw new Error("DB_URL is not defined");
        }

        if (!mongooseCache.connectionPromise) {
            mongooseCache.connectionPromise = mongoose
                .connect(process.env.DB_URL, {
                    serverSelectionTimeoutMS: 30000,
                })
                .then((db) => {
                    console.log("MongoDB connected Successfully");
                    return db.connection;
                })
                .catch((error) => {
                    mongooseCache.connectionPromise = null;
                    throw error;
                });
        }

        mongooseCache.connection = await mongooseCache.connectionPromise;
        return mongooseCache.connection;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

export default connectDB;