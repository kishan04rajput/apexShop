import { getConfiguration } from "../../configuration/configuration.js";
import { getUserCacheInstance } from "../../factory/cache.factory.js";

const prefixUserInformation = "user:info:";
const preFixUserCacheAcessToken = "user:jwt:token:access";

export const setUserInCache = async (user) => {
    const config = getConfiguration();
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
    // console.log("----->getUserFromCache");
    const config = getConfiguration();
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

export const setAccessTokenInCacheUser = async (email, jti, accessToken) => {
    const config = getConfiguration();
    const cacheKey = generateUserAccessTokenCacheKey(email, jti);
    let cacheClient = await getUserCacheInstance(config);
    await cacheClient.set(cacheKey, accessToken);
    await cacheClient.expire(cacheKey, config.userCacheTtl);
};

const generateUserCacheKey = (email) => {
    return prefixUserInformation + email;
};

const generateUserAccessTokenCacheKey = (email, jti) => {
    return `${preFixUserCacheAcessToken}:${email}:${jti}`;
};
