import { getUserModel } from "../../models/user.model.js";

export const findUserByEmailInDatabase = async (email) => {
    // console.log("----->findUserByEmailInDatabase");
    try {
        const userModel = await getUserModel();
        const response = await userModel.findOne({ email });
        return response;
    } catch (error) {
        return { error };
    }
};

export const createNewUserInDatabase = async (newUser) => {
    // console.log("----->createNewUserInDatabase");
    try {
        const response = await newUser.save();
        return response;
    } catch (error) {
        console.log("----->error at createNewUserInDatabase");
        return { error };
    }
};

export const saveUserRefreshTokenInDatabase = async (user) => {
    try {
        const response = await user.save({ validateBeforeSave: false });
        return response;
    } catch (error) {
        return { error };
    }
};

export const updateUserProfileInDatabase = async (user) => {
    try {
        const response = await user.save();
        return response;
    } catch (error) {
        return { error };
    }
};

export const convertToUserDatabaseObject = async (plainUserObject) => {
    try {
        const userModel = await getUserModel();
        let userInstance = await userModel.hydrate(plainUserObject);
        return userInstance;
    } catch (error) {
        return { error };
    }
};
