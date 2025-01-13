import jwt from "jsonwebtoken";
import { getConfig } from "../config/config.js";
const config = getConfig();
// console.log("jwt.util.js", config);
export const generateAccessToken = (id, email, role) => {
    return jwt.sign(
        { id: id, email: email, role: role },
        config.accessTokenSecret,
        { expiresIn: config.accessTokenExpiry }
    );
};

export const generateRefreshToken = (id) => {
    return jwt.sign({ id: id }, config.refreshTokenSecret, {
        expiresIn: config.refreshTokenExpiry,
    });
};