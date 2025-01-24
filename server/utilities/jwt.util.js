import jwt from "jsonwebtoken";
import { getConfiguration } from "../configuration/configuration.js";
import { nanoid } from "nanoid";
const configuration = getConfiguration();
// console.log("jwt.util.js", configuration);
export const generateAccessTokenUtility = (id, email, type) => {
    let jwtId = nanoid();
    return [
        jwt.sign(
            {
                iss: "ApexShop",
                sub: email,
                aud: [type],
                nbf: Math.floor(Date.now() / 1000),
                iat: Date.now(),
                jti: jwtId,
            },
            configuration.accessTokenSecret,
            { expiresIn: configuration.accessTokenExpiry }
        ),
        jwtId,
    ];
};

export const generateRefreshTokenUtility = (id, email, type) => {
    return jwt.sign(
        {
            iss: "ApexShop",
            sub: email,
            aud: [type],
            nbf: Math.floor(Date.now() / 1000),
            iat: Date.now(),
            jti: nanoid(),
        },
        configuration.refreshTokenSecret,
        {
            expiresIn: configuration.refreshTokenExpiry,
        }
    );
};
