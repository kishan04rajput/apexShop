import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    convertToUserDatabaseObject,
    createNewUserInDatabase,
    findUserByEmailInDatabase,
    saveUserRefreshTokenInDatabase,
    updateUserProfileInDatabase,
} from "../../database/user/user.database.js";
import { getUserModel } from "../../models/user.model.js";
import {
    getUserFromCache,
    setUserInCache,
} from "../../cache/user/user.cache.js";

export const checkIfUserExistsService = async (email) => {
    // console.log("----->checkIfUserExistsService");
    let user = await getUserFromCache(email);
    if (!user) {
        user = await findUserByEmailInDatabase(email);
        if (!user) {
            return null;
        } else if (user.error) {
            return { error: user.error };
        }

        await setUserInCache(user);
    }
    user = convertToUserDatabaseObject(user);
    return user;
};

export const createNewUserService = async (email, password, salt) => {
    // console.log("----->createNewUserService");
    const userModel = await getUserModel();
    const newUser = new userModel({
        email,
        password,
        salt,
    });

    return await createNewUserInDatabase(newUser);
};

export const compareUserPasswordService = async (
    userPassword,
    databasePassword
) => {
    try {
        const response = bcrypt.compareSync(userPassword, databasePassword);
        return response;
    } catch (error) {
        return { error };
    }
};

export const saveUserRefreshTokenService = async (user, refreshToken) => {
    user.refreshToken = refreshToken;
    return await saveUserRefreshTokenInDatabase(user);
};

export const decodeUserJwtTokenService = async (jwtToken, secretKey) => {
    // TODO: change name to suitable name which can justify its function
    try {
        return jwt.verify(jwtToken, secretKey);
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const updateUserProfileService = async (email, updatedData) => {
    let user = await checkIfUserExistsService(email);
    if (!user || user.error) {
        return { error: "User Not Found!" };
    }

    updatedData.phone ? (user.phone = updatedData.phone) : null;
    updatedData.name ? (user.name = updatedData.name) : null;
    updatedData.password
        ? ((user.password = updatedData.password),
          user.oldPassword.push({ password: user.password, salt: user.salt }))
        : null;
    updatedData.salt ? (user.salt = updatedData.salt) : null;
    updatedData.created_by ? (user.created_by = updatedData.created_by) : null;
    updatedData.updated_by ? (user.updated_by = updatedData.updated_by) : null;
    updatedData.is_deleted ? (user.is_deleted = updatedData.is_deleted) : null;
    updatedData.deleted_at ? (user.deleted_at = updatedData.deleted_at) : null;
    updatedData.is_deactivated
        ? (user.is_deactivated = updatedData.is_deactivated)
        : null;
    updatedData.deactivated_at
        ? (user.deactivated_at = updatedData.deactivated_at)
        : null;
    updatedData.DOB ? (user.DOB = updatedData.DOB) : null;
    updatedData.Country ? (user.Country = updatedData.Country) : null;
    updatedData.state ? (user.state = updatedData.state) : null;
    updatedData.city ? (user.city = updatedData.city) : null;
    const response = await updateUserProfileInDatabase(user);
    if (response.error) {
        return { error: "User Not Found!" };
    }
    return response;
};
