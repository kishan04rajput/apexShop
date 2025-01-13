import bcrypt from "bcrypt";

export const createHashedPasswordUtil = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return [hashedPassword, salt];
};
