import { createClient } from "redis";

let cacheClient = null;

export const getCacheClient = async () => {
    if (cacheClient == null) {
        cacheClient = createClient();
        try {
            await cacheClient.connect();
            console.log("cache connected successfully.");
        } catch (e) {
            console.log("cache connection issue\n", e);
        }
    }
    return cacheClient;
};
