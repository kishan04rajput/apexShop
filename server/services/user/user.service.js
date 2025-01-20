import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    convertToUserDBObj,
    createNewUserDB,
    findUserUsingEmailDB,
    saveUserRefreshTokenDB,
    userProfielUpdateDB,
} from "../../database/user/user.database.js";
import { getUserModel } from "../../models/user.model.js";
import {
    getUserFromCache,
    setUserInCache,
} from "../../cache/user/user.cache.js";

export const checkIfUserExistSvc = async (email) => {
    let user = await getUserFromCache(email);
    if (!user) {
        user = await findUserUsingEmailDB(email);
        if (!user) {
            return null;
        }

        await setUserInCache(user);
    }
    user = convertToUserDBObj(user);
    return user;
};

export const createNewUserSvc = async (email, password, salt) => {
    const userModel = await getUserModel();
    const newUser = new userModel({
        email,
        password,
        salt,
        oldPassword: [{ password, salt }],
    });

    return await createNewUserDB(newUser);
};

export const compareUserPasswordSvc = async (userPassword, dbPassword) => {
    return bcrypt.compareSync(userPassword, dbPassword);
};

export const saveUserRefreshTokenSvc = async (user, refreshToken) => {
    user.refreshToken = refreshToken;
    return await saveUserRefreshTokenDB(user);
};

export const decodeUserJwtTokenSvc = async (jwtToken, key) => {
    // TODO: change name to suitable name which can justify it's function
    try {
        return jwt.verify(jwtToken, key);
    } catch (e) {
        console.log(e);
        return null;
    }
};

export const userProfileUpdateSvc = async (email, updatedData) => {
    let user = await checkIfUserExistSvc(email);
    if (!user) {
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
    return await userProfielUpdateDB(user);
};
