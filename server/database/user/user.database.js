import { getUserModel } from "../../models/user.model.js";

export const findUserByEmailInDatabase = async (email) => {
    const userModel = await getUserModel();
    return await userModel.findOne({ email });
};

export const createNewUserInDatabase = async (newUser) => {
    return await newUser.save();
};

export const saveUserRefreshTokenInDatabase = async (user) => {
    return await user.save({ validateBeforeSave: false });
};

export const updateUserProfileInDatabase = async (user) => {
    return await user.save();
};

export const convertToUserDatabaseObject = async (plainUserObject) => {
    const userModel = await getUserModel();
    let userInstance = await userModel.hydrate(plainUserObject);
    return userInstance;
};
