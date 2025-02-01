import { getCacheClient } from "../cache/config.cache.js";
import logger from "../utilities/logger.util.js";

var cacheInstanceObject = {};

export const setupCacheFactory = async (configuration) => {
    if (Object.keys(cacheInstanceObject).length == 0) {
        // await getCacheClient();
        await getUserCacheInstance(configuration);
        await getSellerCacheInstance(configuration);
        await getAdminCacheInstance(configuration);
        await getCustomerRelationshipCacheInstance(configuration);
    }
    return true;
};

export const getUserCacheInstance = async (configuration) => {
    // console.log("----->getUserCacheInstance");
    if (!!cacheInstanceObject?.userCache) {
        logger.info("User cache hit!");
        return cacheInstanceObject.userCache;
    }
    let userCache = await getCacheClient(configuration.cacheUriUser);
    if (!!userCache) {
        logger.info("User cache connected successfully");
        cacheInstanceObject.userCache = userCache;
        return userCache;
    }
    logger.error("User cache miss!");
    throw "User cache connection error";
};

export const getSellerCacheInstance = async (configuration) => {
    if (!!cacheInstanceObject?.sellerCache) {
        logger.info("Seller cache hit!");
        return cacheInstanceObject.sellerCache;
    }
    let sellerCache = await getCacheClient(configuration.cacheUriSeller);
    if (!!sellerCache) {
        logger.info("Seller cache connected successfully");
        cacheInstanceObject.sellerCache = sellerCache;
        return sellerCache;
    }
    logger.info("Seller cache miss!");
    throw "Seller cache connection error";
};

export const getAdminCacheInstance = async (configuration) => {
    if (!!cacheInstanceObject?.adminCache) {
        logger.info("Administrator cache hit!");
        return cacheInstanceObject.adminCache;
    }
    let adminCache = await getCacheClient(configuration.cacheUriAdmin);
    if (!!adminCache) {
        logger.info("Admin cache connected successfully");
        cacheInstanceObject.adminCache = adminCache;
        // logger.info("Admin cache hit!");
        return adminCache;
    }
    logger.info("Administrator cache miss!");
    throw "Admin cache connection error";
};

export const getCustomerRelationshipCacheInstance = async (configuration) => {
    if (!!cacheInstanceObject?.customerRelationshipCache) {
        logger.info("CustomerRelationship cache hit!");
        return cacheInstanceObject.customerRelationshipCache;
    }
    let customerRelationshipCache = await getCacheClient(
        configuration.cacheUriCustomerRelationship
    );
    if (!!customerRelationshipCache) {
        logger.info("Customer relationship cache connected successfully");
        cacheInstanceObject.customerRelationshipCache =
            customerRelationshipCache;
        return customerRelationshipCache;
    }
    logger.info("CustomerRelationship cache miss!");
    throw "Customer relationship cache connection error";
};
