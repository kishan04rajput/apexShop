import mongoose from "mongoose";
import logger from "../utilities/logger.util.js";

export const connectToMongoDatabase = async (connectionUri) => {
    try {
        let mongooseInstance = new mongoose.Mongoose();
        return await mongooseInstance.connect(connectionUri);
    } catch (error) {
        // console.error(connectionUri, "\n", error);
        logger.error(connectionUri, "\n", error);
        return null;
    }
};
