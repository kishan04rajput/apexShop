import { getConfig } from "../../config/config.js";
import { getCacheClient } from "../config.cache.js";

const config = getConfig();

const prefixUserInfo = "user:info:";
const userDbIndex = 0; // Using database 0 for users

export const setUserInCache = async (user) => {
    if (!user?.email) {
        throw "Invalid user";
    }
    let client = await getCacheClient(userDbIndex);

    let stringifiedUser = JSON.stringify(user);

    let key = getUserCacheKey(user.email);
    await client.set(key, stringifiedUser);
    await client.expire(key, config.userCacheTtl);
};

export const getUserFromCache = async (email) => {
    if (!email || email === "") {
        throw "Invalid email";
    }

    let client = await getCacheClient(userDbIndex);

    let stringifiedUser = await client.get(getUserCacheKey(email));
    if (!stringifiedUser) {
        return null;
    }
    let user = JSON.parse(stringifiedUser);
    return user;
};

const getUserCacheKey = (email) => {
    return prefixUserInfo + email;
};
