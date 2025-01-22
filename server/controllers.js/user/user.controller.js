import { setAccessTokenInCacheUser } from "../../cache/user/user.cache.js";
import {
    checkIfUserExistSvc,
    compareUserPasswordSvc,
    createNewUserSvc,
    saveUserRefreshTokenSvc,
    userProfileUpdateSvc,
} from "../../services/user/user.service.js";
import { createHashedPasswordUtil } from "../../utilities/createHashedPassword.util.js";
import { decryptPassword } from "../../utilities/decryptPassword.util.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utilities/jwt.util.js";
import logger from "../../utilities/logger.util.js";
import {
    handleErrorResUtil,
    handleSuccessResUtil,
} from "../../utilities/response.util.js";

export const signupController = async (req, res) => {
    logger.info(req);
    const myPlaintextPassword = decryptPassword(req?.body?.password);
    const email = req?.body?.email;

    let isUserExist = await checkIfUserExistSvc(email);

    if (isUserExist) {
        return handleErrorResUtil(
            res,
            409,
            "failed",
            "user already exist in system"
        );
    }

    const [hashedPassword, salt] = await createHashedPasswordUtil(
        myPlaintextPassword
    );

    const response = await createNewUserSvc(email, hashedPassword, salt);

    // console.log(response._id);
    req.user = response;
    req.user.id = response._id;
    if (!response) {
        return handleErrorResUtil(res, 409, "failed", "internal server error!");
    }

    return handleSuccessResUtil(
        res,
        200,
        "success",
        "User created successfully!"
    );
};

export const loginController = async (req, res) => {
    // logger.info(req);
    // console.log(req);

    const myPlaintextPassword = decryptPassword(req?.body?.password);
    const email = req?.body?.email;

    const user = await checkIfUserExistSvc(email);
    if (!user) {
        return handleErrorResUtil(res, 404, "failed", "No user found!");
    }

    const isPasswordCorrect = await compareUserPasswordSvc(
        myPlaintextPassword,
        user.password
    );

    if (!isPasswordCorrect) {
        return handleErrorResUtil(res, 401, "failed", "Wrong password!");
    }

    const [accessToken, accessTokenJti] = generateAccessToken(
        user._id,
        user.email,
        user.type
    );
    const refreshToken = generateRefreshToken(user._id, user.email, user.type);

    await setAccessTokenInCacheUser(
        `user:jwt:token:Access:${user.email}`,
        `${accessTokenJti}:${accessToken}`
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
    req.user = user._doc;
    req.user.id = _id;
    return handleSuccessResUtil(res, 200, "success", "user loggedin", {
        ApexShopAccessToken: accessToken,
        ...otherDetails,
    });
};

export const getUserDetailsController = async (req, res) => {
    let user = req.user;

    if (!user) {
        return handleErrorResUtil(res, 404, "failed!", "User not found!");
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

    return handleSuccessResUtil(
        res,
        200,
        "success",
        "data fetched successfully",
        otherDetails
    );
};

export const userProfileUpdateController = async (req, res) => {
    let email = req?.user?.email;
    let updatedData = req.body;
    let response = await userProfileUpdateSvc(email, updatedData);
    if (response.error) {
        // console.log(response.error);
        return handleErrorResUtil(res, 404, "failed", response.error);
        // return res.status(404).json({ error: response.error });
    }

    return handleSuccessResUtil(
        res,
        200,
        "success",
        "data updated successfully",
        updatedData
    );
};

export const userUpdatePassword = async (req, res) => {
    let email = req?.user?.email;
    const myPlaintextPassword = decryptPassword(req?.body?.password);
    try {
        const [hashedPassword, salt] = await createHashedPasswordUtil(
            myPlaintextPassword
        );

        let updatedData = {
            password: hashedPassword,
            salt,
        };
        let response = await userProfileUpdateSvc(email, updatedData);
        if (!response) {
            return handleErrorResUtil(
                res,
                500,
                "error",
                "An unexpected error occurred"
            );
        }
        return handleSuccessResUtil(res, 200, "success", "password updated");
    } catch (err) {
        logger.error(err);
        return handleErrorResUtil(
            res,
            500,
            "error",
            "An unexpected error occurred",
            `error---->${err}`
        );
    }
};
