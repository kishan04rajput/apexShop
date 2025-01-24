import { getConfiguration } from "../../configuration/configuration.js";
import { getCrCacheInstance } from "../../factory/cache.factory.js";

const prefixCustomerRelationshipInformation = "cr:info:";

export const setCustomerRelationshipInCache = async (customerRelationship) => {
    const config = getConfiguration();
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
    const config = getConfiguration();
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
