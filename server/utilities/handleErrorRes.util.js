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
