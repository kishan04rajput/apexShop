import { createClient } from "redis";
import logger from "../utilities/logger.util.js";

export const getCacheClient = async (uri) => {
    let cacheClient = createClient({ url: uri });
    try {
        await cacheClient.connect();
        // await cacheClient.select(dbIndex);
        logger.info(`Connected to Redis database ${uri}`);
    } catch (e) {
        logger.error(e);
    }
    return cacheClient;
};
