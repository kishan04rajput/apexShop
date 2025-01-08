import {
    checkIfUserExistSvc,
    compareUserPasswordSvc,
    createHashedPasswordSvc,
    createNewUserSvc,
    decodeUserJwtTokenSvc,
    saveUserRefreshTokenSvc,
    userProfileUpdateSvc,
} from "../services/user/user.svc.js";

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
    const cookieValue = req?.cookies?.ApexShopAccessToken;
    if (!cookieValue) {
        return res.status(404).send("Please Login!");
    }
    let { email } = await decodeUserJwtTokenSvc(
        cookieValue,
        process.env.ACCESS_TOKEN_SECRET
    );
    if (!email) {
        return res.status(404).send("User Not Found!");
    }
    let user = await checkIfUserExistSvc(email);

    if (!user) {
        return res.status(404).send("User not found!");
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

    return res.status(200).json(otherDetails);
};

export const userProfileUpdateController = async (req, res) => {
    const cookieValue = req?.cookies?.ApexShopAccessToken;
    if (!cookieValue) {
        return res.status(404).send("Please Login!");
    }
    let { email } = await decodeUserJwtTokenSvc(
        cookieValue,
        process.env.ACCESS_TOKEN_SECRET
    );
    if (!email) {
        return res.status(404).send("User Not Found!");
    }
    let updatedData = req.body;
    let response = await userProfileUpdateSvc(email, updatedData);
    if (response.error) {
        console.log(response.error);
        return res.status(404).json({ error: response.error });
    }

    return res.status(200).json({ updatedData });
};

export const userUpdatePassword = async (req, res) => {
    const cookieValue = req?.cookies?.ApexShopAccessToken;
    if (!cookieValue) {
        return res.status(404).send("Please login!");
    }
    const { email } = await decodeUserJwtTokenSvc(
        cookieValue,
        process.env.ACCESS_TOKEN_SECRET
    );
    if (!email) {
        return res.status(404).send("User Not Found!");
    }
    const myPlaintextPassword = req?.body?.password;
    const [hashedPassword, salt] = await createHashedPasswordSvc(
        myPlaintextPassword
    );

    let updatedData = {
        password: hashedPassword,
        salt,
    };
    await userProfileUpdateSvc(email, updatedData);

    res.status(200).json({ msg: "password updated" });
};
