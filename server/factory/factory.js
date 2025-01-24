import { setupDatabaseFactory } from "./database.factory.js";
import { setupCacheFactory } from "./cache.factory.js";

export const setupFactory = async (configuration) => {
    await setupDatabaseFactory(configuration);
    await setupCacheFactory(configuration);
    return true;
};
