export const handleErrorResUtil = (
    res,
    httpCode = 400,
    status,
    errMsg = null
) => {
    let response;
    if (errMsg) {
        response = { status, errMsg };
    } else {
        response = { status };
    }

    return res.status(httpCode).json(response);
};

export const handleSuccessResUtil = (
    res,
    httpCode = 400,
    status,
    msg,
    data = null
) => {
    let response;
    if (data) {
        response = { status, msg, data };
    } else {
        response = { status, msg };
    }

    return res.status(httpCode).json(response);
};
