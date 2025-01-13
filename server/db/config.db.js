import mongoose from "mongoose";
import logger from "../utilities/logger.util.js";

export const connectMongoDB = async (uri) => {
    try {
        let instance = new mongoose.Mongoose();
        return await instance.connect(uri);
    } catch (error) {
        // console.error(uri, "\n", error);
        logger.error(uri, "\n", error);
        return null;
    }
};
