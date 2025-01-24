export const decodeFromBase64Utility = (base64EncodedString) => {
    const decodedString = Buffer.from(base64EncodedString, "base64").toString(
        "utf-8"
    );
    return decodedString;
};
