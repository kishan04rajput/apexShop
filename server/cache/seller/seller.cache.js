import { getConfig } from "../../config/config.js";
import { getSellerCacheInstance } from "../../factory/cache.factory.js";
import { getCacheClient } from "../config.cache.js";

const config = getConfig();

const prefixSellerInfo = "seller:info:";

export const setSellerInCache = async (seller) => {
    if (!seller?.email) {
        throw "Invalid seller";
    }
    let client = await getSellerCacheInstance(config);

    let stringifiedSeller = JSON.stringify(seller);

    let key = getSellerCacheKey(seller.email);
    await client.set(key, stringifiedSeller);
    await client.expire(key, config.sellerCacheTtl);
};

export const getSellerFromCache = async (email) => {
    if (!email || email === "") {
        throw "Invalid email";
    }

    let client = await getSellerCacheInstance(config);

    let stringifiedSeller = await client.get(getSellerCacheKey(email));
    if (!stringifiedSeller) {
        return null;
    }
    let seller = JSON.parse(stringifiedSeller);
    return seller;
};

export const setAccessTokenInCacheSeller = async (key, accessToken) => {
    let client = await getSellerCacheInstance(config);
    await client.set(key, accessToken);
    await client.expire(key, config.userCacheTtl);
};

const getSellerCacheKey = (email) => {
    return prefixSellerInfo + email;
};
