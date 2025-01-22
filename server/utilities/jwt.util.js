import jwt from "jsonwebtoken";
import { getConfig } from "../config/config.js";
import { nanoid } from "nanoid";
const config = getConfig();
// console.log("jwt.util.js", config);
export const generateAccessToken = (id, email, type) => {
    return jwt.sign(
        {
            iss: "ApexShop",
            sub: email,
            aud: [type],
            nbf: Date.now(),
            iat: Date.now(),
            jti: nanoid(),
        },
        config.accessTokenSecret,
        { expiresIn: config.accessTokenExpiry }
    );
};

export const generateRefreshToken = (id, email, type) => {
    return jwt.sign(
        {
            iss: "ApexShop",
            sub: email,
            aud: [type],
            nbf: Date.now(),
            iat: Date.now(),
            jti: nanoid(),
        },
        config.refreshTokenSecret,
        {
            expiresIn: config.refreshTokenExpiry,
        }
    );
};
