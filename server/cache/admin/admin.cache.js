import { getConfig } from "../../config/config.js";
import { getCacheClient } from "../config.cache.js";

const config = getConfig();

const prefixAdminInfo = "admin:info:";
const adminDbIndex = 3; // Using database 3 for admin

export const setAdminInCache = async (admin) => {
    if (!admin?.email) {
        throw "Invalid admin";
    }
    let client = await getCacheClient(adminDbIndex);

    let stringifiedAdmin = JSON.stringify(admin);

    let key = getAdminCacheKey(admin.email);
    await client.set(key, stringifiedAdmin);
    await client.expire(key, config.adminCacheTtl);
};

export const getAdminFromCache = async (email) => {
    if (!email || email === "") {
        throw "Invalid email";
    }

    let client = await getCacheClient(adminDbIndex);

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
