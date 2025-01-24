import { getConfiguration } from "../../configuration/configuration.js";
import { getSellerCacheInstance } from "../../factory/cache.factory.js";

const config = getConfiguration();

const prefixSellerInformation = "seller:info:";

export const setSellerInCache = async (seller) => {
    if (!seller?.email) {
        throw "Invalid seller";
    }
    let cacheClient = await getSellerCacheInstance(config);

    let stringifiedSeller = JSON.stringify(seller);

    let cacheKey = generateSellerCacheKey(seller.email);
    await cacheClient.set(cacheKey, stringifiedSeller);
    await cacheClient.expire(cacheKey, config.sellerCacheTtl);
};

export const getSellerFromCache = async (email) => {
    if (!email || email === "") {
        throw "Invalid email";
    }

    let cacheClient = await getSellerCacheInstance(config);

    let stringifiedSeller = await cacheClient.get(
        generateSellerCacheKey(email)
    );
    if (!stringifiedSeller) {
        return null;
    }
    let seller = JSON.parse(stringifiedSeller);
    return seller;
};

export const setAccessTokenInCacheSeller = async (cacheKey, accessToken) => {
    let cacheClient = await getSellerCacheInstance(config);
    await cacheClient.set(cacheKey, accessToken);
    await cacheClient.expire(cacheKey, config.userCacheTtl);
};

const generateSellerCacheKey = (email) => {
    return prefixSellerInformation + email;
};
