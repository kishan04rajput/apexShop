const configuration = {};

export const setupConfiguration = () => {
    // console.log("----->setupConfiguration");
    let errors = [];

    // getting values from .env
    let mongoUserUri = process.env.MONGODB_URI_USER;
    let mongoSellerUri = process.env.MONGODB_URI_SELLER;
    let mongoAdminUri = process.env.MONGODB_URI_ADMIN;
    let mongoCustomerRelationshipUri =
        process.env.MONGODB_URI_CUSTOMER_RELATIONSHIP;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY;
    let accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || "600";
    let refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET_KEY;
    let refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || "600";
    let userCacheTtl = process.env.USER_CACHE_TTL || "600";
    let sellerCacheTtl = process.env.SELLER_CACHE_TTL || "600";
    let adminCacheTtl = process.env.ADMIN_CACHE_TTL || "600";
    let customerRelationshipCacheTtl = process.env.CR_CACHE_TTL || "600";
    let loggerLevel = process.env.LOGGER_LEVEL || "silly";
    let userCacheDatabaseIndex = process.env.USER_CACHE_DB_INDEX || "0";
    let sellerCacheDatabaseIndex = process.env.SELLER_CACHE_DB_INDEX || "1";
    let adminCacheDatabaseIndex = process.env.ADMIN_CACHE_DB_INDEX || "2";
    let customerRelationshipCacheDatabaseIndex =
        process.env.CR_CACHE_DB_INDEX || "3";
    let cacheUriUser = process.env.CACHE_URI_USER;
    let cacheUriSeller = process.env.CACHE_URI_SELLER;
    let cacheUriAdmin = process.env.CACHE_URI_ADMIN;
    let cacheUriCustomerRelationship =
        process.env.CACHE_URI_CUSTOMER_RELATIONSHIP;
    let privateKeyBase64 = process.env.PRIVATE_KEY_BASE_64;

    let userAccessTokenSecretKey = process.env.USER_ACCESS_TOKEN_SECRET_KEY;
    let userRefreshTokenSecretKey = process.env.USER_REFRESH_TOKEN_SECRET_KEY;

    let sellerAccessTokenSecretKey = process.env.SELLER_ACCESS_TOKEN_SECRET_KEY;
    let sellerRefreshTokenSecretKey =
        process.env.SELLER_REFRESH_TOKEN_SECRET_KEY;

    let adminAccessTokenSecretKey = process.env.ADMIN_ACCESS_TOKEN_SECRET_KEY;
    let adminRefreshTokenSecretKey = process.env.ADMIN_REFRESH_TOKEN_SECRET_KEY;

    let crAccessTokenSecretKey = process.env.CR_ACCESS_TOKEN_SECRET_KEY;
    let crRefreshTokenSecretKey = process.env.CR_REFRESH_TOKEN_SECRET_KEY;

    // check mandatory env variables

    !userAccessTokenSecretKey
        ? errors.push("USER_ACCESS_TOKEN_SECRET_KEY")
        : (configuration.userAccessTokenSecretKey = userAccessTokenSecretKey);
    !userRefreshTokenSecretKey
        ? errors.push("USER_REFRESH_TOKEN_SECRET_KEY")
        : (configuration.userRefreshTokenSecretKey = userRefreshTokenSecretKey);

    !sellerAccessTokenSecretKey
        ? errors.push("SELLER_ACCESS_TOKEN_SECRET_KEY")
        : (configuration.sellerAccessTokenSecretKey =
              sellerAccessTokenSecretKey);
    !sellerRefreshTokenSecretKey
        ? errors.push("USER_REFRESH_TOKEN_SECRET_KEY")
        : (configuration.sellerRefreshTokenSecretKey =
              sellerRefreshTokenSecretKey);

    !adminAccessTokenSecretKey
        ? errors.push("ADMIN_ACCESS_TOKEN_SECRET_KEY")
        : (configuration.adminAccessTokenSecretKey = adminAccessTokenSecretKey);
    !adminRefreshTokenSecretKey
        ? errors.push("ADMIN_REFRESH_TOKEN_SECRET_KEY")
        : (configuration.adminRefreshTokenSecretKey =
              adminRefreshTokenSecretKey);

    !crAccessTokenSecretKey
        ? errors.push("CR_ACCESS_TOKEN_SECRET_KEY")
        : (configuration.crAccessTokenSecretKey = crAccessTokenSecretKey);
    !crRefreshTokenSecretKey
        ? errors.push("CR_REFRESH_TOKEN_SECRET_KEY")
        : (configuration.crRefreshTokenSecretKey = crRefreshTokenSecretKey);

    !privateKeyBase64
        ? errors.push("PRIVATE_KEY_BASE_64")
        : (configuration.privateKeyBase64 = privateKeyBase64);
    !cacheUriSeller
        ? errors.push("CACHE_URI_SELLER")
        : (configuration.cacheUriSeller = cacheUriSeller);
    !cacheUriAdmin
        ? errors.push("CACHE_URI_ADMIN")
        : (configuration.cacheUriAdmin = cacheUriAdmin);
    !cacheUriCustomerRelationship
        ? errors.push("CACHE_URI_CR")
        : (configuration.cacheUriCustomerRelationship =
              cacheUriCustomerRelationship);
    !cacheUriUser
        ? errors.push("CACHE_URI_USER")
        : (configuration.cacheUriUser = cacheUriUser);
    !mongoUserUri
        ? errors.push("MONGO_URI_USER")
        : (configuration.mongoUserUri = mongoUserUri);
    !mongoSellerUri
        ? errors.push("MONGO_URI_SELLER")
        : (configuration.mongoSellerUri = mongoSellerUri);
    !mongoAdminUri
        ? errors.push("MONGO_URI_ADMIN")
        : (configuration.mongoAdminUri = mongoAdminUri);
    !mongoCustomerRelationshipUri
        ? errors.push("MONGO_URI_CR")
        : (configuration.mongoCustomerRelationshipUri =
              mongoCustomerRelationshipUri);
    !jwtSecretKey
        ? errors.push("JWT_SECRET_KEY")
        : (configuration.jwtSecretKey = jwtSecretKey);
    !accessTokenSecret
        ? errors.push("ACCESS_TOKEN_SECRET")
        : (configuration.accessTokenSecret = accessTokenSecret);
    !refreshTokenSecret
        ? errors.push("REFRESH_TOKEN_SECRET")
        : (configuration.refreshTokenSecret = refreshTokenSecret);

    if (errors.length > 0) {
        throw errors.join(", ") + " mandatory values are missing";
    }

    configuration.accessTokenExpiry = accessTokenExpiry;
    configuration.refreshTokenExpiry = refreshTokenExpiry;
    configuration.userCacheTtl = userCacheTtl;
    configuration.sellerCacheTtl = sellerCacheTtl;
    configuration.loggerLevel = loggerLevel;
    configuration.adminCacheTtl = adminCacheTtl;
    configuration.customerRelationshipCacheTtl = customerRelationshipCacheTtl;
    configuration.userCacheDatabaseIndex = userCacheDatabaseIndex;
    configuration.sellerCacheDatabaseIndex = sellerCacheDatabaseIndex;
    configuration.adminCacheDatabaseIndex = adminCacheDatabaseIndex;
    configuration.customerRelationshipCacheDatabaseIndex =
        customerRelationshipCacheDatabaseIndex;

    return configuration;
};

export const getConfiguration = () => {
    // console.log("----->getConfiguration");
    if (Object.keys(configuration).length === 0) {
        setupConfiguration();
    }
    return configuration;
};
