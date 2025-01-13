import jwt from "jsonwebtoken";
import { getConfig } from "../config/config";
const config = getConfig();
export const generateAccessToken = (id, email, role) => {
    return jwt.sign(
        { id: id, email: email, role: role },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: config.ACCESS_TOKEN_EXPIRY }
    );
};

export const generateRefreshToken = (id) => {
    return jwt.sign({ id: id }, config.REFRESH_TOKEN_SECRET, {
        expiresIn: config.REFRESH_TOKEN_EXPIRY,
    });
};
