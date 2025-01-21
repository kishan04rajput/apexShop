import { getCacheClient } from "../cache/config.cache.js";
import logger from "../utilities/logger.util.js";

var cacheInstanceObj = {};

export const setupCacheFactory = async (config) => {
    if (Object.keys(cacheInstanceObj).length == 0) {
        // await getCacheClient();
        await getUserCacheInstance(config);
        await getSellerCacheInstance(config);
        await getAdminCacheInstance(config);
        await getCrCacheInstance(config);
    }
    return true;
};

export const getUserCacheInstance = async (config) => {
    if (!!cacheInstanceObj?.userCache) {
        return cacheInstanceObj.userCache;
    }
    let userCache = await getCacheClient(config.userCacheDbIndex);
    if (!!userCache) {
        logger.info("User cache connected successfully");
        cacheInstanceObj.userCache = userCache;
        return userCache;
    }
    throw "User cache connect error";
};

export const getSellerCacheInstance = async (config) => {
    if (!!cacheInstanceObj?.sellerCache) {
        return cacheInstanceObj.sellerCache;
    }
    let sellerCache = await getCacheClient(config.sellerCacheDbIndex);
    if (!!sellerCache) {
        logger.info("Seller cache connected successfully");
        cacheInstanceObj.sellerCache = sellerCache;
        return sellerCache;
    }
    throw "Seller cache connect error";
};

export const getAdminCacheInstance = async (config) => {
    if (!!cacheInstanceObj?.adminCache) {
        return cacheInstanceObj.adminCache;
    }
    let adminCache = await getCacheClient(config.adminCacheDbIndex);
    if (!!adminCache) {
        logger.info("Admin cache connected successfully");
        cacheInstanceObj.adminCache = adminCache;
        return adminCache;
    }
    throw "Admin cache connect error";
};

export const getCrCacheInstance = async (config) => {
    if (!!cacheInstanceObj?.crCache) {
        return cacheInstanceObj.crCache;
    }
    let crCache = await getCacheClient(config.crCacheDbIndex);
    if (!!crCache) {
        logger.info("CR cache connected successfully");
        cacheInstanceObj.crCache = crCache;
        return crCache;
    }
    throw "CR cache connect error";
};
