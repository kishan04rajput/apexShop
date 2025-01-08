import userModel from "../../models/user.model.js";
export const findUserUsingEmailDB = async (email) => {
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
