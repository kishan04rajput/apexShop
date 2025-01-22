import {
    checkIfSellerExistSvc,
    compareSellerPasswordSvc,
    createNewSellerSvc,
    saveSellerRefreshTokenSvc,
    sellerProfileUpdateSvc,
} from "../../services/seller/seller.service.js";
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
    // logger.info(req);
    const myPlaintextPassword = decryptPassword(req?.body?.password);
    const email = req?.body?.email;

    let isSellerExist = await checkIfSellerExistSvc(email);

    if (isSellerExist) {
        return handleErrorResUtil(
            res,
            409,
            "failed",
            "seller already exist in system"
        );
    }

    const [hashedPassword, salt] = await createHashedPasswordUtil(
        myPlaintextPassword
    );

    const response = await createNewSellerSvc(email, hashedPassword, salt);
    if (!response) {
        return handleErrorResUtil(res, 409, "failed", "internal server error!");
    }

    return handleSuccessResUtil(
        res,
        200,
        "success",
        "Seller created successfully!"
    );
};

export const loginController = async (req, res) => {
    const myPlaintextPassword = decryptPassword(req?.body?.password);
    const email = req?.body?.email;

    const seller = await checkIfSellerExistSvc(email);
    if (!seller) {
        return handleErrorResUtil(res, 404, "failed", "No seller found!");
    }

    const isPasswordCorrect = await compareSellerPasswordSvc(
        myPlaintextPassword,
        seller.password
    );

    if (!isPasswordCorrect) {
        return handleErrorResUtil(res, 401, "failed", "Wrong password!");
    }

    const accessToken = generateAccessToken(seller._id, seller.email, 2);
    const refreshToken = generateRefreshToken(seller._id);

    const {
        password,
        refreshToken: _,
        _id,
        __v,
        oldPassword,
        salt,
        ...otherDetails
    } = seller._doc;
    req.user = seller._doc;
    req.user.id = _id;
    return handleSuccessResUtil(res, 200, "success", "seller loggedin", {
        ApexShopAccessToken: accessToken,
        ...otherDetails,
    });
};

export const getSellerDetailsController = async (req, res) => {
    let seller = req.user;

    if (!seller) {
        return handleErrorResUtil(res, 404, "failed!", "Seller not found!");
    }
    const {
        password,
        salt,
        refreshToken,
        _id,
        __v,
        oldPassword,
        ...otherDetails
    } = seller._doc;

    return handleSuccessResUtil(
        res,
        200,
        "success",
        "data fetched successfully",
        otherDetails
    );
};

export const sellerProfileUpdateController = async (req, res) => {
    let email = req?.user?.email;
    let updatedData = req.body;

    let response = await sellerProfileUpdateSvc(email, updatedData);
    if (response.error) {
        return handleErrorResUtil(res, 404, "failed", response.error);
    }

    return handleSuccessResUtil(
        res,
        200,
        "success",
        "data updated successfully",
        updatedData
    );
};

export const sellerUpdatePassword = async (req, res) => {
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
        let response = await sellerProfileUpdateSvc(email, updatedData);
        if (!response) {
            return handleErrorResUtil(
                res,
                500,
                "error",
                "An unexpected error occurred"
            );
        }
        return handleSuccessResUtil(
            res,
            200,
            "success",
            "password updated successfully"
        );
    } catch (err) {
        logger.error(`err from sellerUpdatePasswordController \n ${err}`);
        return handleErrorResUtil(
            res,
            500,
            "error",
            "An unexpected error occurred",
            `error---->${err}`
        );
    }
};
