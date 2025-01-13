const config = {};

export const setupConfig = () => {
    let err = [];

    // getting values from .env
    let mongoUserUri = process.env.MONGO_URI_USER;
    let mongoSellerUri = process.env.MONGO_URI_SELLER;
    let mongoAdminUri = process.env.MONGO_URI_ADMIN;

    // check mandatory env variables
    !mongoUserUri
        ? err.push("MONGO_URI_USER")
        : (config.mongoUserUri = mongoUserUri);
    !mongoSellerUri
        ? err.push("MONGO_URI_SELLER")
        : (config.mongoSellerUri = mongoSellerUri);
    !mongoAdminUri
        ? err.push("MONGO_URI_ADMIN")
        : (config.mongoAdminUri = mongoAdminUri);

    if (err.length > 0) {
        throw err.join(", ") + " mandatory values are missing";
    }

    return config;
};

export const getConfig = () => {
    if (Object.keys(config).length == 0) {
        throw "call setupConfig in main";
    }
    return config;
};
