import { getConfig } from "../../configuration/configuration.js";
import { getCrCacheInstance } from "../../factory/cache.factory.js";
import { getCacheClient } from "../config.cache.js";

const config = getConfig();

const prefixCustomerRelationshipInformation = "cr:info:";
const customerRelationshipDatabaseIndex = 2; // Using database 2 for customer relationship

export const setCustomerRelationshipInCache = async (customerRelationship) => {
    if (!customerRelationship?.email) {
        throw "Invalid customer relationship";
    }
    let cacheClient = await getCrCacheInstance(config);

    let stringifiedCustomerRelationship = JSON.stringify(customerRelationship);

    let cacheKey = generateCustomerRelationshipCacheKey(
        customerRelationship.email
    );
    await cacheClient.set(cacheKey, stringifiedCustomerRelationship);
    await cacheClient.expire(cacheKey, config.customerRelationshipCacheTtl);
};

export const getCustomerRelationshipFromCache = async (email) => {
    if (!email || email === "") {
        throw "Invalid email";
    }

    let cacheClient = await getCrCacheInstance(config);

    let stringifiedCustomerRelationship = await cacheClient.get(
        generateCustomerRelationshipCacheKey(email)
    );
    if (!stringifiedCustomerRelationship) {
        return null;
    }
    let customerRelationship = JSON.parse(stringifiedCustomerRelationship);
    return customerRelationship;
};

const generateCustomerRelationshipCacheKey = (email) => {
    return prefixCustomerRelationshipInformation + email;
};
