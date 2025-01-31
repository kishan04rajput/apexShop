import jwt from "jsonwebtoken";
import { getConfiguration } from "../configuration/configuration.js";
import { nanoid } from "nanoid";

// console.log("jwt.util.js", configuration);
export const generateAccessTokenUtility = (
    id,
    email,
    type,
    accessTokenSecretKey
) => {
    const configuration = getConfiguration();
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
            accessTokenSecretKey,
            { expiresIn: configuration.accessTokenExpiry }
        ),
        jwtId,
    ];
};

export const generateRefreshTokenUtility = (id, email, type) => {
    const configuration = getConfiguration();
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
