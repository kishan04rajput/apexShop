import crypto from "crypto";
import { getConfiguration } from "../configuration/configuration.js";
import { decodeFromBase64Utility } from "./decodeFromBase64.util.js";

export const decryptPasswordUtility = (encryptedPassword) => {
    const configuration = getConfiguration();
    const privateKey = decodeFromBase64Utility(configuration.privateKeyBase64);
    const buffer = Buffer.from(encryptedPassword, "base64");
    let decryptedPassword = crypto.privateDecrypt(privateKey, buffer);
    return decryptedPassword;
};
