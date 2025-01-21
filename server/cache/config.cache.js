import { createClient } from "redis";
import logger from "../utilities/logger.util.js";

export const getCacheClient = async (dbIndex = 0) => {
    let cacheClient = createClient();
    try {
        await cacheClient.connect();
        await cacheClient.select(dbIndex);
        logger.info(`Connected to Redis database ${dbIndex}`);
    } catch (e) {
        logger.error(e);
    }
    return cacheClient;
};
