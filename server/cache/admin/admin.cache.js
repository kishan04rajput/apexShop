import { getConfig } from "../../config/config.js";
import { getAdminCacheInstance } from "../../factory/cache.factory.js";
const config = getConfig();

const prefixAdminInfo = "admin:info:";

export const setAdminInCache = async (admin) => {
    if (!admin?.email) {
        throw "Invalid admin";
    }
    let client = await getAdminCacheInstance(config);

    let stringifiedAdmin = JSON.stringify(admin);

    let key = getAdminCacheKey(admin.email);
    await client.set(key, stringifiedAdmin);
    await client.expire(key, config.adminCacheTtl);
};

export const getAdminFromCache = async (email) => {
    if (!email || email === "") {
        throw "Invalid email";
    }

    let client = await getAdminCacheInstance(config);

    let stringifiedAdmin = await client.get(getAdminCacheKey(email));
    if (!stringifiedAdmin) {
        return null;
    }
    let admin = JSON.parse(stringifiedAdmin);
    return admin;
};

const getAdminCacheKey = (email) => {
    return prefixAdminInfo + email;
};
