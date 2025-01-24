import { getConfig } from "../../configuration/configuration.js";
import { getAdminCacheInstance } from "../../factory/cache.factory.js";
const config = getConfig();

const prefixAdminInformation = "admin:info:";

export const setAdministratorInCache = async (administrator) => {
    if (!administrator?.email) {
        throw "Invalid administrator";
    }
    let cacheClient = await getAdminCacheInstance(config);

    let stringifiedAdministrator = JSON.stringify(administrator);

    let cacheKey = generateAdminCacheKey(administrator.email);
    await cacheClient.set(cacheKey, stringifiedAdministrator);
    await cacheClient.expire(cacheKey, config.adminCacheTtl);
};

export const getAdministratorFromCache = async (email) => {
    if (!email || email === "") {
        throw "Invalid email";
    }

    let cacheClient = await getAdminCacheInstance(config);

    let stringifiedAdministrator = await cacheClient.get(
        generateAdminCacheKey(email)
    );
    if (!stringifiedAdministrator) {
        return null;
    }
    let administrator = JSON.parse(stringifiedAdministrator);
    return administrator;
};

const generateAdminCacheKey = (email) => {
    return prefixAdminInformation + email;
};
