import { getConfig } from "../../config/config.js";
import { getCacheClient } from "../config.cache.js";

const config = getConfig();
// if (!!config) {
//     console.log("config.USER_CACHE_TTL", config);
// }

const prefixUserInfo = "user:info:";
export const setUserInCache = async (user) => {
    if (!user?.email) {
        throw "Invalid user";
    }
    let client = await getCacheClient();

    let stringifiedUser = JSON.stringify(user);

    let key = getUserCacheKey(user.email);
    await client.set(key, stringifiedUser);
    await client.expire(key, config.USER_CACHE_TTL);
};

export const getUserFromCache = async (email) => {
    if (!email || email == "") {
        throw "Invalid email";
    }

    let client = await getCacheClient();

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
