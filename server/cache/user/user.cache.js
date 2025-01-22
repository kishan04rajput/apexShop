import { getConfig } from "../../config/config.js";
import { getUserCacheInstance } from "../../factory/cache.factory.js";

const config = getConfig();

const prefixUserInfo = "user:info:";

export const setUserInCache = async (user) => {
    if (!user?.email) {
        throw "Invalid user";
    }
    let client = await getUserCacheInstance(config);

    let stringifiedUser = JSON.stringify(user);

    let key = getUserCacheKey(user.email);
    await client.set(key, stringifiedUser);
    await client.expire(key, config.userCacheTtl);
};

export const getUserFromCache = async (email) => {
    if (!email || email === "") {
        throw "Invalid email";
    }

    let client = await getUserCacheInstance(config);

    let stringifiedUser = await client.get(getUserCacheKey(email));
    if (!stringifiedUser) {
        return null;
    }
    let user = JSON.parse(stringifiedUser);
    return user;
};

export const setAccessTokenInCacheUser = async (key, accessToken) => {
    let client = await getUserCacheInstance(config);
    await client.set(key, accessToken);
    await client.expire(key, config.userCacheTtl);
};

const getUserCacheKey = (email) => {
    return prefixUserInfo + email;
};
