import { setupDatabaseFactory } from "./database.factory.js";

export const setupFactory = async (config) => {
    await setupDatabaseFactory(config);

    return true;
};
