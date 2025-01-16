import { getConfig } from "../../config/config.js";
import { getCacheClient } from "../config.cache.js";

const config = getConfig();

const prefixSellerInfo = "seller:info:";
const sellerDbIndex = 1; // Using database 1 for sellers

export const setSellerInCache = async (seller) => {
    if (!seller?.email) {
        throw "Invalid seller";
    }
    let client = await getCacheClient(sellerDbIndex);

    let stringifiedSeller = JSON.stringify(seller);

    let key = getSellerCacheKey(seller.email);
    await client.set(key, stringifiedSeller);
    await client.expire(key, config.sellerCacheTtl);
};

export const getSellerFromCache = async (email) => {
    if (!email || email === "") {
        throw "Invalid email";
    }

    let client = await getCacheClient(sellerDbIndex);

    let stringifiedSeller = await client.get(getSellerCacheKey(email));
    if (!stringifiedSeller) {
        return null;
    }
    let seller = JSON.parse(stringifiedSeller);
    return seller;
};

const getSellerCacheKey = (email) => {
    return prefixSellerInfo + email;
};
