import {
    checkIfUserExistSvc,
    compareUserPasswordSvc,
    createNewUserSvc,
    saveUserRefreshTokenSvc,
    userProfileUpdateSvc,
} from "../services/user/user.svc.js";
import { createHashedPasswordUtil } from "../utilities/createHashedPassword.util.js";
import { handleErrorResUtil } from "../utilities/handleErrorRes.util.js";
import { handleSuccessResUtil } from "../utilities/handleSuccessRes.utilis.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utilities/jwt.utilis.js";

export const signupController = async (req, res) => {
    const myPlaintextPassword = req?.body?.password;
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
    const myPlaintextPassword = req?.body?.password;
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

    const accessToken = generateAccessToken(user._id, user.email, 2);
    const refreshToken = generateRefreshToken(user._id);

    const {
        password,
        refreshToken: _,
        _id,
        __v,
        oldPassword,
        salt,
        ...otherDetails
    } = user._doc;
    return handleSuccessResUtil(
        res,
        200,
        "user loggedin",
        { ...otherDetails },
        { ApexShopAccessToken: accessToken }
    );
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

    return handleSuccessResUtil(res, 200, "success", otherDetails);
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

    return handleSuccessResUtil(res, 200, "success", updatedData);
};

export const userUpdatePassword = async (req, res) => {
    let email = req?.user?.email;
    const myPlaintextPassword = req?.body?.password;
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
        console.log(err);
        return handleErrorResUtil(
            res,
            500,
            "error",
            "An unexpected error occurred",
            `error---->${err}`
        );
    }
};
