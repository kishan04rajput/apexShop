import { getCacheClient } from "../cache/config.cache.js";
import { connectMongoDB } from "../database/config.database.js";
import logger from "../utilities/logger.util.js";

var instanceObj = {};
export const setupDatabaseFactory = async (config) => {
    if (Object.keys(instanceObj).length == 0) {
        await getCacheClient();
        await getUserMongoInstance(config);
        await getSellerMongoInstance(config);
        await getAdminMongoInstance(config);
        await getCrMongoInstance(config);
    }
    return true;
};

export const getUserMongoInstance = async (config) => {
    if (!!instanceObj?.userDB) {
        return instanceObj.userDB;
    }
    let userDB = await connectMongoDB(config.mongoUserUri);
    if (!!userDB) {
        logger.info("user db connected successfully");
        instanceObj.userDB = userDB;
        return userDB;
    }
    throw "User DB Connect error";
};

export const getSellerMongoInstance = async (config) => {
    if (!!instanceObj?.sellerDB) {
        return instanceObj.sellerDB;
    }
    let sellerDB = await connectMongoDB(config.mongoSellerUri);
    if (!!sellerDB) {
        logger.info("seller db connected successfully");
        instanceObj.sellerDB = sellerDB;
        return sellerDB;
    }

    throw "seller db connect error";
};

export const getAdminMongoInstance = async (config) => {
    if (!!instanceObj?.adminDB) {
        return instanceObj.adminDB;
    }
    let adminDB = await connectMongoDB(config.mongoAdminUri);
    if (!!adminDB) {
        logger.info("admin db connected successfully");
        instanceObj.adminDB = adminDB;
        return adminDB;
    }

    throw "admin db connect error";
};

export const getCrMongoInstance = async (config) => {
    if (!!instanceObj?.CrDB) {
        return instanceObj.CrDB;
    }
    let crDB = await connectMongoDB(config.mongoCrUri);
    if (!!crDB) {
        logger.info("cr db connected successfully");
        instanceObj.crDB = crDB;
        return crDB;
    }

    throw "cr db connect error";
};