import {
    checkIfUserExistSvc,
    compareUserPasswordSvc,
    createHashedPasswordSvc,
    createNewUserSvc,
    saveUserRefreshTokenSvc,
    userProfileUpdateSvc,
} from "../services/user/user.svc.js";
import {
    handleErrorResponse,
    handleSuccessResponse,
} from "../utilis/session.utili.js";

export const signupController = async (req, res) => {
    try {
        const myPlaintextPassword = req?.body?.password;
        const email = req?.body?.email;

        let isUserExist = await checkIfUserExistSvc(email);
        if (isUserExist) {
            res.status(409).json({
                msg: "user already exist in system",
                status: "failed",
            });
            return;
        }

        const [hashedPassword, salt] = await createHashedPasswordSvc(
            myPlaintextPassword
        );

        await createNewUserSvc(email, hashedPassword, salt);

        res.status(200).send("User created successfully!");
    } catch (e) {
        res.send(e);
    }
};

export const loginController = async (req, res) => {
    const myPlaintextPassword = req?.body?.password;
    const email = req?.body?.email;

    const user = await checkIfUserExistSvc(email);
    if (!user) {
        return res.status(404).send("No user found!");
    }

    const isPasswordCorrect = await compareUserPasswordSvc(
        myPlaintextPassword,
        user.password
    );

    if (!isPasswordCorrect) {
        return res.status(401).send("Wrong password!");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    await saveUserRefreshTokenSvc(user, refreshToken);

    const {
        password,
        refreshToken: _,
        _id,
        __v,
        oldPassword,
        salt,
        ...otherDetails
    } = user._doc;
    res.cookie("ApexShopAccessToken", accessToken)
        .status(200)
        .json({ ...otherDetails });
};

export const getUserDetailsController = async (req, res) => {
    let user = req.user;

    if (!user) {
        return handleErrorResponse(res, 404, "User not found!");
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

    return handleSuccessResponse(res, 200, "success", otherDetails);
};

export const userProfileUpdateController = async (req, res) => {
    let email = req?.user?.email;
    let updatedData = req.body;
    let response = await userProfileUpdateSvc(email, updatedData);
    if (response.error) {
        console.log(response.error);
        return res.status(404).json({ error: response.error });
    }

    return res.status(200).json(updatedData);
};

export const userUpdatePassword = async (req, res) => {
    let email = req?.user?.email;
    const myPlaintextPassword = req?.body?.password;
    try {
        const [hashedPassword, salt] = await createHashedPasswordSvc(
            myPlaintextPassword
        );

        let updatedData = {
            password: hashedPassword,
            salt,
        };
        await userProfileUpdateSvc(email, updatedData);
        return handleSuccessResponse(res, 200, "password updated", null);
    } catch (err) {
        console.log(err);
        return handleErrorResponse(res, 500, err);
    }
};
