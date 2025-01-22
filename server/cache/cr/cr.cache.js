import { getConfig } from "../../config/config.js";
import { getCrCacheInstance } from "../../factory/cache.factory.js";
import { getCacheClient } from "../config.cache.js";

const config = getConfig();

const prefixCrInfo = "cr:info:";
const crDbIndex = 2; // Using database 2 for cr

export const setCrInCache = async (cr) => {
    if (!cr?.email) {
        throw "Invalid cr";
    }
    let client = await getCrCacheInstance(config);

    let stringifiedCr = JSON.stringify(cr);

    let key = getCrCacheKey(cr.email);
    await client.set(key, stringifiedCr);
    await client.expire(key, config.crCacheTtl);
};

export const getCrFromCache = async (email) => {
    if (!email || email === "") {
        throw "Invalid email";
    }

    let client = await getCrCacheInstance(config);

    let stringifiedCr = await client.get(getCrCacheKey(email));
    if (!stringifiedCr) {
        return null;
    }
    let cr = JSON.parse(stringifiedCr);
    return cr;
};

const getCrCacheKey = (email) => {
    return prefixCrInfo + email;
};
