import { setupDatabaseFactory } from "./database.factory";

export const setupFactory = async (config) => {
    await setupDatabaseFactory(config);

    return true;
};
