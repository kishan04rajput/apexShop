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
