import { setupDatabaseFactory } from "./database.factory.js";
import { setupCacheFactory } from "./cache.factory.js";

export const setupFactory = async (config) => {
    await setupDatabaseFactory(config);
    await setupCacheFactory(config);
    return true;
};
