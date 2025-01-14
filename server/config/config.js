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
    let accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
    let refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    let refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
    let userCacheTtl = process.env.USER_CACHE_TTL;

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
    !accessTokenExpiry
        ? err.push("ACCESS_TOKEN_EXPIRY")
        : (config.accessTokenExpiry = accessTokenExpiry);
    !refreshTokenSecret
        ? err.push("REFRESH_TOKEN_SECRET")
        : (config.refreshTokenSecret = refreshTokenSecret);
    !refreshTokenExpiry
        ? err.push("REFRESH_TOKEN_EXPIRY")
        : (config.refreshTokenExpiry = refreshTokenExpiry);
    !userCacheTtl
        ? err.push("USER_CACHE_TTL")
        : (config.userCacheTtl = userCacheTtl);

    if (err.length > 0) {
        throw err.join(", ") + " mandatory values are missing";
    }

    return config;
};

export const getConfig = () => {
    if (Object.keys(config).length == 0) {
        setupConfig();
    }
    return config;
};
