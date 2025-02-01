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
        logger.info("User database hit!");
        return databaseInstanceObject.userDatabase;
    }
    let userDatabase = await connectToMongoDatabase(configuration.mongoUserUri);
    if (!!userDatabase) {
        logger.info("User database connected successfully");
        databaseInstanceObject.userDatabase = userDatabase;
        return userDatabase;
    }
    logger.info("User database miss!");
    throw "User database connection error";
};

export const getSellerMongoDatabaseInstance = async (configuration) => {
    if (!!databaseInstanceObject?.sellerDatabase) {
        logger.info("Seller database hit!");
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
    logger.info("Seller database miss!");

    throw "Seller database connection error";
};

export const getAdminMongoDatabaseInstance = async (configuration) => {
    if (!!databaseInstanceObject?.adminDatabase) {
        logger.info("Administrator database hit!");
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
    logger.info("Administrator database miss!");

    throw "Admin database connection error";
};

export const getCustomerRelationshipMongoDatabaseInstance = async (
    configuration
) => {
    if (!!databaseInstanceObject?.customerRelationshipDatabase) {
        logger.info("CustomerRelationship database hit!");
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
    logger.info("CustomerRelationship database miss!");

    throw "Customer relationship database connection error";
};
