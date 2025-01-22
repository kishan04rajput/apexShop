import jwt from "jsonwebtoken";
import { getConfig } from "../config/config.js";
import { nanoid } from "nanoid";
const config = getConfig();
// console.log("jwt.util.js", config);
export const generateAccessToken = (id, email, role) => {
    return jwt.sign(
        {
            iss: "ApexShop",
            sub: email,
            aud: ["all"],
            nbf: Date.now(),
            iat: Date.now(),
            jti: nanoid(),
            role: role,
        },
        config.accessTokenSecret,
        { expiresIn: config.accessTokenExpiry }
    );
};

export const generateRefreshToken = (id, email, role) => {
    return jwt.sign(
        {
            iss: "ApexShop",
            sub: email,
            aud: ["all"],
            nbf: Date.now(),
            iat: Date.now(),
            jti: nanoid(),
            role: role,
        },
        config.refreshTokenSecret,
        {
            expiresIn: config.refreshTokenExpiry,
        }
    );
};
