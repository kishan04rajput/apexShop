import crypto from "crypto";
import { getConfig } from "../config/config.js";
import { decodeFromBase64 } from "./decodeFromBase64.util.js";

export const decryptPassword = (encryptedPassword) => {
    const config = getConfig();
    const privateKey = decodeFromBase64(config.privateKeyBase64);
    const buffer = Buffer.from(encryptedPassword, "base64");
    let decryptedPassword = crypto.privateDecrypt(privateKey, buffer);
    return decryptedPassword;
};
