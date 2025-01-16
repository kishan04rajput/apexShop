import { createClient } from "redis";
import logger from "../utilities/logger.util.js";

let cacheClient = null;

export const getCacheClient = async (dbIndex = 0) => {
    if (cacheClient == null) {
        cacheClient = createClient();
        try {
            await cacheClient.connect();
            await cacheClient.select(dbIndex);
            logger.info(`Connected to Redis database ${dbIndex}`);
        } catch (e) {
            logger.error(e);
        }
    } else {
        await cacheClient.select(dbIndex);
    }
    return cacheClient;
};
