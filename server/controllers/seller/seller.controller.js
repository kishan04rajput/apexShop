import { setAccessTokenInCacheSeller } from "../../cache/seller/seller.cache.js";
import {
    checkIfSellerExistsService,
    compareSellerPasswordService,
    createNewSellerService,
    saveSellerRefreshTokenService,
    updateSellerProfileService,
} from "../../services/seller/seller.service.js";
import { createHashedPasswordUtility } from "../../utilities/hash.util.js";
import { decryptPasswordUtility } from "../../utilities/crypto.util.js";
import {
    generateAccessTokenUtility,
    generateRefreshTokenUtility,
} from "../../utilities/jwt.util.js";
import logger from "../../utilities/logger.util.js";
import {
    handleErrorResponseUtility,
    handleSuccessResponseUtility,
} from "../../utilities/response.util.js";
import { getConfiguration } from "../../configuration/configuration.js";

export const signupSellerController = async (request, response) => {
    // logger.info(req);
    const plainTextPassword = (request?.body?.password);
    const email = request?.body?.email;

    let sellerExists = await checkIfSellerExistsService(email);

    if (sellerExists.error) {
        return handleErrorResponseUtility(
            response,
            500,
            "failed",
            "internal server error!"
        );
    }
    if (sellerExists) {
        return handleErrorResponseUtility(
            response,
            409,
            "failed",
            "Seller already exists in the system"
        );
    }

    const [hashedPassword, salt] = await createHashedPasswordUtility(
        plainTextPassword
    );

    const createdSeller = await createNewSellerService(
        email,
        hashedPassword,
        salt
    );
    request.user = createdSeller;
    request.user.id = createdSeller._id;
    if (!createdSeller) {
        return handleErrorResponseUtility(
            response,
            500,
            "failed",
            "Internal server error!"
        );
    }

    return handleSuccessResponseUtility(
        response,
        201,
        "success",
        "Seller created successfully!"
    );
};

export const loginSellerController = async (request, response) => {
    const configuration = getConfiguration();
    if (request?.body?.password.length === 0) {
        return handleErrorResponseUtility(
            response,
            400,
            "failed",
            "Password cannot be empty!"
        );
    }
    const plainTextPassword = (request?.body?.password);
    if (plainTextPassword.error) {
        return handleErrorResponseUtility(
            response,
            400,
            "failed",
            "Incorrect password format"
        );
    }
    const email = request?.body?.email;

    const seller = await checkIfSellerExistsService(email);
    if (!seller) {
        return handleErrorResponseUtility(
            response,
            404,
            "failed",
            "No seller found!"
        );
    }

    const isPasswordCorrect = await compareSellerPasswordService(
        plainTextPassword,
        seller.password
    );

    if (isPasswordCorrect.error) {
        return handleErrorResponseUtility(
            response,
            500,
            "failed",
            "Internal server error!"
        );
    }

    if (!isPasswordCorrect) {
        return handleErrorResponseUtility(
            response,
            401,
            "failed",
            "Wrong password!"
        );
    }

    const [accessToken, accessTokenJti] = generateAccessTokenUtility(
        seller._id,
        seller.email,
        seller.type,
        configuration.sellerAccessTokenSecretKey
    );
    const refreshToken = generateRefreshTokenUtility(
        seller._id,
        seller.email,
        seller.type
    );

    await setAccessTokenInCacheSeller(
        seller.email,
        accessTokenJti,
        accessToken
    );

    const {
        password,
        refreshToken: _,
        _id,
        __v,
        oldPassword,
        salt,
        is_deleted,
        ...otherDetails
    } = seller._doc;
    request.user = seller._doc;
    request.user.id = _id;
    return handleSuccessResponseUtility(
        response,
        200,
        "success",
        "Seller logged in successfully",
        {
            ApexShopAccessToken: accessToken,
            ...otherDetails,
        }
    );
};

export const getSellerDetailsController = async (request, response) => {
    let seller = request.user;

    if (!seller || !seller._doc) {
        return handleErrorResponseUtility(
            response,
            404,
            "failed",
            "Seller not found!"
        );
    }
    const {
        password,
        salt,
        refreshToken,
        _id,
        __v,
        oldPassword,
        is_deleted,
        ...otherDetails
    } = seller._doc;

    return handleSuccessResponseUtility(
        response,
        200,
        "success",
        "Seller details fetched successfully",
        otherDetails
    );
};

export const updateSellerProfileController = async (request, response) => {
    let email = request?.user?.email;
    let updatedData = request.body;

    let updateResponse = await updateSellerProfileService(email, updatedData);
    // console.log("updateResponse----->", updateResponse.error);
    if (updateResponse.error) {
        return handleErrorResponseUtility(
            response,
            400,
            "failed",
            updateResponse.error
        );
    }

    return handleSuccessResponseUtility(
        response,
        200,
        "success",
        "Seller profile updated successfully",
        updatedData
    );
};

export const updateSellerPasswordController = async (request, response) => {
    let email = request?.user?.email;
    const plainTextPassword = (request?.body?.password);
    try {
        const [hashedPassword, salt] = await createHashedPasswordUtility(
            plainTextPassword
        );

        let updatedData = {
            password: hashedPassword,
            salt,
        };
        let updateResponse = await updateSellerProfileService(
            email,
            updatedData
        );
        if (!updateResponse) {
            return handleErrorResponseUtility(
                response,
                500,
                "failed",
                "An unexpected error occurred!"
            );
        }
        return handleSuccessResponseUtility(
            response,
            200,
            "success",
            "Seller password updated successfully"
        );
    } catch (error) {
        logger.error(`Error from updateSellerPasswordController \n ${error}`);
        return handleErrorResponseUtility(
            response,
            500,
            "failed",
            "An unexpected error occurred",
            `${error}`
        );
    }
};
