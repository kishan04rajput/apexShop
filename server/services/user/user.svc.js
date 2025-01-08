import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    createNewUserDB,
    findUserUsingEmailDB,
    saveUserRefreshTokenDB,
    userProfielUpdateDB,
} from "../../db/user/user.db.js";
import userModel from "../../models/user.model.js";

export const checkIfUserExistSvc = async (email) => {
    return await findUserUsingEmailDB(email);
};

export const createHashedPasswordSvc = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return [hashedPassword, salt];
};

export const createNewUserSvc = async (email, password, salt) => {
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
    await saveUserRefreshTokenDB(user);
};

export const decodeUserJwtTokenSvc = async (jwtToken, key) => {
    return jwt.verify(jwtToken, key);
};

export const userProfileUpdateSvc = async (email, updatedData) => {
    let user = await checkIfUserExistSvc(email);
    if (!user) {
        return { error: "User Not Found!" };
    }

    updatedData.phone ? (user.phone = updatedData.phone) : null;
    updatedData.name ? (user.name = updatedData.name) : null;
    updatedData.password ? (user.password = updatedData.password) : null;
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
