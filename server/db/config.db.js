import mongoose from "mongoose";

export const connectMongoDB = async (uri) => {
    try {
        let instance = new mongoose.Mongoose();
        return await instance.connect(uri);
    } catch (error) {
        console.log(uri, "\n", error);
        return null;
    }
};
