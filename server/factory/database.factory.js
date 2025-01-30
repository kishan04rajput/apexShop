import { getCacheClient } from "../cache/config.cache.js";
import { connectToMongoDatabase } from "../database/config.database.js";
import logger from "../utilities/logger.util.js";

var databaseInstanceObject = {};
export const setupDatabaseFactory = async (configuration) => {
    if (Object.keys(databaseInstanceObject).length == 0) {
        // await getCacheClient();
        await getUserMongoDatabaseInstance(configuration);
        await getSellerMongoDatabaseInstance(configuration);
        await getAdminMongoDatabaseInstance(configuration);
        await getCustomerRelationshipMongoDatabaseInstance(configuration);
    }
    return true;
};

export const getUserMongoDatabaseInstance = async (configuration) => {
    // console.log("----->getUserMongoDatabaseInstance");
    if (!!databaseInstanceObject?.userDatabase) {
        return databaseInstanceObject.userDatabase;
    }
    let userDatabase = await connectToMongoDatabase(configuration.mongoUserUri);
    if (!!userDatabase) {
        logger.info("User database connected successfully");
        databaseInstanceObject.userDatabase = userDatabase;
        return userDatabase;
    }
    throw "User database connection error";
};

export const getSellerMongoDatabaseInstance = async (configuration) => {
    if (!!databaseInstanceObject?.sellerDatabase) {
        return databaseInstanceObject.sellerDatabase;
    }
    let sellerDatabase = await connectToMongoDatabase(
        configuration.mongoSellerUri
    );
    if (!!sellerDatabase) {
        logger.info("Seller database connected successfully");
        databaseInstanceObject.sellerDatabase = sellerDatabase;
        return sellerDatabase;
    }

    throw "Seller database connection error";
};

export const getAdminMongoDatabaseInstance = async (configuration) => {
    if (!!databaseInstanceObject?.adminDatabase) {
        return databaseInstanceObject.adminDatabase;
    }
    let adminDatabase = await connectToMongoDatabase(
        configuration.mongoAdminUri
    );
    if (!!adminDatabase) {
        logger.info("Admin database connected successfully");
        databaseInstanceObject.adminDatabase = adminDatabase;
        return adminDatabase;
    }

    throw "Admin database connection error";
};

export const getCustomerRelationshipMongoDatabaseInstance = async (
    configuration
) => {
    if (!!databaseInstanceObject?.customerRelationshipDatabase) {
        return databaseInstanceObject.customerRelationshipDatabase;
    }
    let customerRelationshipDatabase = await connectToMongoDatabase(
        configuration.mongoCustomerRelationshipUri
    );
    if (!!customerRelationshipDatabase) {
        logger.info("Customer relationship database connected successfully");
        databaseInstanceObject.customerRelationshipDatabase =
            customerRelationshipDatabase;
        return customerRelationshipDatabase;
    }

    throw "Customer relationship database connection error";
};
