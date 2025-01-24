import bcrypt from "bcrypt";

export const createHashedPasswordUtility = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return [hashedPassword, salt];
};
