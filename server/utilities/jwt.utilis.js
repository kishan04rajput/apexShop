import jwt from "jsonwebtoken";
export const generateAccessToken = (id, email, role) => {
    return jwt.sign(
        { id: id, email: email, role: role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

export const generateRefreshToken = (id) => {
    return jwt.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};
