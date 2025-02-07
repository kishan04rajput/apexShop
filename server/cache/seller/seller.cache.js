import { getConfiguration } from "../../configuration/configuration.js";
import { getSellerCacheInstance } from "../../factory/cache.factory.js";

const prefixSellerInformation = "seller:info:";
const preFixSellerCacheAcessToken = "seller:jwt:token:access";

export const setSellerInCache = async (seller) => {
    const config = getConfiguration();
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
    const config = getConfiguration();
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

export const setAccessTokenInCacheSeller = async (email, jti, accessToken) => {
    const config = getConfiguration();
    const cacheKey = generateSellerAccessTokenCacheKey(email, jti);
    let cacheClient = await getSellerCacheInstance(config);
    await cacheClient.set(cacheKey, accessToken);
    await cacheClient.expire(cacheKey, config.userCacheTtl);
};

const generateSellerCacheKey = (email) => {
    return prefixSellerInformation + email;
};

const generateSellerAccessTokenCacheKey = (email, jti) => {
    return `${preFixSellerCacheAcessToken}:${email}:${jti}`;
};
