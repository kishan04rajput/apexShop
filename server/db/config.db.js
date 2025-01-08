import mongoose from "mongoose";

export const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected!");
        return true;
    } catch (error) {
        console.log("DB not connected---->\n", error);
        return false;
    }
};
