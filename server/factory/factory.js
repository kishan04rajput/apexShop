import { getCacheClient } from "../cache/config.cache.js";
import { connectMongoDB } from "../db/config.db.js";

var instanceObj = {};
export const setupFactory = async (config) => {
    if (Object.keys(instanceObj).length == 0) {
        await getCacheClient();
        await getUserMongoInstance(config);
        await getSellerMongoInstance(config);
        await getAdminMongoInstance(config);
    }
    return true;
};

export const getUserMongoInstance = async (config) => {
    if (!!instanceObj?.userDB) {
        return instanceObj.userDB;
    }
    let userDB = await connectMongoDB(config.mongoUserUri);
    if (!!userDB) {
        console.log("user db connected successfully");
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
        console.log("seller db connected successfully");
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
        console.log("admin db connected successfully");
        instanceObj.adminDB = adminDB;
        return adminDB;
    }

    throw "admin db connect error";
};
