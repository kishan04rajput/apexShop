import {
    RequiredErrorResponseParameterMissing,
    RequiredSuccessResponseParameterMissing,
} from "../constants/constants.js";

export const handleSuccessResponse = (res, statusCode, msg, data) => {
    if (!res || !statusCode || !msg) {
        return res.status(400).json({
            code: RequiredSuccessResponseParameterMissing,
            error: "Something went wrong",
        });
    }
    let respData = {
        code: statusCode,
        msg: msg,
        data: data,
    };
    if (respData.data == null) {
        delete respData["data"];
    }
    return res.status(statusCode).json(respData);
};

export const handleErrorResponse = (res, statusCode, errorMsg) => {
    if (!res || !statusCode || !errorMsg) {
        return res.status(400).json({
            code: RequiredErrorResponseParameterMissing,
            error: "Something went wrong",
        });
    }
    return res.status(statusCode).json({
        code: statusCode,
        error: errorMsg,
    });
};
