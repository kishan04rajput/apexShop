import { createClient } from "redis";
import logger from "../utilities/logger.util.js";

export const getCacheClient = async (connectionUri) => {
    let cacheClient = createClient({ url: connectionUri });
    try {
        await cacheClient.connect();
        // await cacheClient.select(databaseIndex);
        logger.info(`Connected to Redis database ${connectionUri}`);
    } catch (error) {
        logger.error(error);
        return null;
    }
    return cacheClient;
};
