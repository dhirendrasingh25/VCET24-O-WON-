import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnect = async () => {
    await mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.log(`Error in connecting to MongoDB: ${err}`);
            process.exit(1);
        });
};

export default dbConnect;
