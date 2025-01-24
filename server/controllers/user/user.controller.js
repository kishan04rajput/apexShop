import { setAccessTokenInCacheUser } from "../../cache/user/user.cache.js";
import {
    checkIfUserExistsService,
    compareUserPasswordService,
    createNewUserService,
    saveUserRefreshTokenService,
    updateUserProfileService,
} from "../../services/user/user.service.js";
import { createHashedPasswordUtility } from "../../utilities/createHashedPassword.util.js";
import { decryptPasswordUtility } from "../../utilities/decryptPassword.util.js";
import {
    generateAccessTokenUtility,
    generateRefreshTokenUtility,
} from "../../utilities/jwt.util.js";
import logger from "../../utilities/logger.util.js";
import {
    handleErrorResponseUtility,
    handleSuccessResponseUtility,
} from "../../utilities/response.util.js";

export const signupUserController = async (request, response) => {
    logger.info(request);
    const plainTextPassword = decryptPasswordUtility(request?.body?.password);
    const email = request?.body?.email;

    let userExists = await checkIfUserExistsService(email);

    if (userExists) {
        return handleErrorResponseUtility(
            response,
            409,
            "failed",
            "User already exists in the system"
        );
    }

    const [hashedPassword, salt] = await createHashedPasswordUtility(
        plainTextPassword
    );

    const createdUser = await createNewUserService(email, hashedPassword, salt);

    // console.log(createdUser._id);
    request.user = createdUser;
    request.user.id = createdUser._id;
    if (!createdUser) {
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
        "User created successfully!"
    );
};

export const loginUserController = async (request, response) => {
    // logger.info(request);
    // console.log(request);

    const plainTextPassword = decryptPasswordUtility(request?.body?.password);
    const email = request?.body?.email;

    const user = await checkIfUserExistsService(email);
    if (!user) {
        return handleErrorResponseUtility(
            response,
            404,
            "failed",
            "No user found!"
        );
    }

    const isPasswordCorrect = await compareUserPasswordService(
        plainTextPassword,
        user.password
    );

    if (!isPasswordCorrect) {
        return handleErrorResponseUtility(
            response,
            401,
            "failed",
            "Wrong password!"
        );
    }

    const [accessToken, accessTokenJti] = generateAccessTokenUtility(
        user._id,
        user.email,
        user.type
    );
    const refreshToken = generateRefreshTokenUtility(
        user._id,
        user.email,
        user.type
    );

    await setAccessTokenInCacheUser(
        `user:jwt:token:Access:${user.email}:${accessTokenJti}`,
        `${accessToken}`
    );

    const {
        password,
        refreshToken: _,
        _id,
        __v,
        oldPassword,
        salt,
        ...otherDetails
    } = user._doc;
    request.user = user._doc;
    request.user.id = _id;
    return handleSuccessResponseUtility(
        response,
        200,
        "success",
        "User logged in successfully",
        {
            ApexShopAccessToken: accessToken,
            ...otherDetails,
        }
    );
};

export const getUserDetailsController = async (request, response) => {
    let user = request.user;

    if (!user) {
        return handleErrorResponseUtility(
            response,
            404,
            "failed",
            "User not found!"
        );
    }
    const {
        password,
        salt,
        refreshToken,
        _id,
        __v,
        oldPassword,
        ...otherDetails
    } = user._doc;

    return handleSuccessResponseUtility(
        response,
        200,
        "success",
        "User details fetched successfully",
        otherDetails
    );
};

export const updateUserProfileController = async (request, response) => {
    let email = request?.user?.email;
    let updatedData = request.body;
    let updateResponse = await updateUserProfileService(email, updatedData);
    if (updateResponse.error) {
        // console.log(updateResponse.error);
        return handleErrorResponseUtility(
            response,
            400,
            "failed",
            updateResponse.error
        );
        // return response.status(404).json({ error: updateResponse.error });
    }

    return handleSuccessResponseUtility(
        response,
        200,
        "success",
        "User profile updated successfully",
        updatedData
    );
};

export const updateUserPasswordController = async (request, response) => {
    let email = request?.user?.email;
    const plainTextPassword = decryptPasswordUtility(request?.body?.password);
    console.log("plainTextPassword = ", plainTextPassword);
    try {
        const [hashedPassword, salt] = await createHashedPasswordUtility(
            plainTextPassword
        );

        let updatedData = {
            password: hashedPassword,
            salt,
        };
        let updateResponse = await updateUserProfileService(email, updatedData);
        if (!updateResponse) {
            return handleErrorResponseUtility(
                response,
                500,
                "failed",
                "An unexpected error occurred"
            );
        }
        return handleSuccessResponseUtility(
            response,
            200,
            "success",
            "User password updated successfully"
        );
    } catch (error) {
        logger.error(error);
        return handleErrorResponseUtility(
            response,
            500,
            "failed",
            "An unexpected error occurred",
            `error---->${error}`
        );
    }
};
