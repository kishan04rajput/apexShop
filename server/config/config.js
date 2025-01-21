const config = {};

export const setupConfig = () => {
    let err = [];

    // getting values from .env
    let mongoUserUri = process.env.MONGO_URI_USER;
    let mongoSellerUri = process.env.MONGO_URI_SELLER;
    let mongoAdminUri = process.env.MONGO_URI_ADMIN;
    let mongoCrUri = process.env.MONGO_URI_CR;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    let accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || "600";
    let refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    let refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || "600";
    let userCacheTtl = process.env.USER_CACHE_TTL || "600";
    let sellerCacheTtl = process.env.SELLER_CACHE_TTL || "600";
    let adminCacheTtl = process.env.ADMIN_CACHE_TTL || "600";
    let crCacheTtl = process.env.CR_CACHE_TTL || "600";
    let loggerLevel = process.env.LOGGER_LEVEL || "silly";
    let userCacheDbIndex = process.env.USER_CACHE_DB_INDEX || "0";
    let sellerCacheDbIndex = process.env.SELLER_CACHE_DB_INDEX || "1";
    let adminCacheDbIndex = process.env.ADMIN_CACHE_DB_INDEX || "2";
    let crCacheDbIndex = process.env.CR_CACHE_DB_INDEX || "3";

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
    !mongoCrUri ? err.push("MONGO_URI_CR") : (config.mongoCrUri = mongoCrUri);
    !jwtSecretKey
        ? err.push("JWT_SECRET_KEY")
        : (config.jwtSecretKey = jwtSecretKey);
    !accessTokenSecret
        ? err.push("ACCESS_TOKEN_SECRET")
        : (config.accessTokenSecret = accessTokenSecret);
    !refreshTokenSecret
        ? err.push("REFRESH_TOKEN_SECRET")
        : (config.refreshTokenSecret = refreshTokenSecret);

    if (err.length > 0) {
        throw err.join(", ") + " mandatory values are missing";
    }

    config.accessTokenExpiry = accessTokenExpiry;
    config.refreshTokenExpiry = refreshTokenExpiry;
    config.userCacheTtl = userCacheTtl;
    config.sellerCacheTtl = sellerCacheTtl;
    config.loggerLevel = loggerLevel;
    config.adminCacheTtl = adminCacheTtl;
    config.crCacheTtl = crCacheTtl;
    config.userCacheDbIndex = userCacheDbIndex;
    config.sellerCacheDbIndex = sellerCacheDbIndex;
    config.adminCacheDbIndex = adminCacheDbIndex;
    config.crCacheDbIndex = crCacheDbIndex;

    return config;
};

export const getConfig = () => {
    if (Object.keys(config).length == 0) {
        setupConfig();
    }
    return config;
};
