import { getConfiguration } from "../../configuration/configuration.js";
import { getUserCacheInstance } from "../../factory/cache.factory.js";

const config = getConfiguration();

const prefixUserInformation = "user:info:";

export const setUserInCache = async (user) => {
    if (!user?.email) {
        throw "Invalid user";
    }
    let cacheClient = await getUserCacheInstance(config);

    let stringifiedUser = JSON.stringify(user);

    let cacheKey = generateUserCacheKey(user.email);
    await cacheClient.set(cacheKey, stringifiedUser);
    await cacheClient.expire(cacheKey, config.userCacheTtl);
};

export const getUserFromCache = async (email) => {
    if (!email || email === "") {
        throw "Invalid email";
    }

    let cacheClient = await getUserCacheInstance(config);

    let stringifiedUser = await cacheClient.get(generateUserCacheKey(email));
    if (!stringifiedUser) {
        return null;
    }
    let user = JSON.parse(stringifiedUser);
    return user;
};

export const setAccessTokenInCacheUser = async (cacheKey, accessToken) => {
    let cacheClient = await getUserCacheInstance(config);
    await cacheClient.set(cacheKey, accessToken);
    await cacheClient.expire(cacheKey, config.userCacheTtl);
};

const generateUserCacheKey = (email) => {
    return prefixUserInformation + email;
};
