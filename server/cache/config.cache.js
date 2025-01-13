import { createClient } from "redis";
import logger from "../utilities/logger.util.js";

let cacheClient = null;

export const getCacheClient = async () => {
    if (cacheClient == null) {
        cacheClient = createClient();
        try {
            await cacheClient.connect();
            logger.info("cache connected successfully.");
        } catch (e) {
            logger.error(e);
        }
    }
    return cacheClient;
};
