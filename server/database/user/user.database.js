import { getUserModel } from "../../models/user.model.js";

export const findUserUsingEmailDB = async (email) => {
    const userModel = await getUserModel();
    return await userModel.findOne({ email });
};

export const createNewUserDB = async (newUser) => {
    return await newUser.save();
};

export const saveUserRefreshTokenDB = async (user) => {
    return await user.save({ validateBeforeSave: false });
};

export const userProfielUpdateDB = async (user) => {
    return await user.save();
};

export const convertToUserDBObj = async (plainUserObj) => {
    const userModel = await getUserModel();
    let User = await userModel.hydrate(plainUserObj);
    return User;
};
