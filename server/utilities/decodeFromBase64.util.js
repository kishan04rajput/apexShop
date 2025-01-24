export const decodeFromBase64 = (base64EncodedStr) => {
    const decodedStr = Buffer.from(base64EncodedStr, "base64").toString(
        "utf-8"
    );
    return decodedStr;
};
