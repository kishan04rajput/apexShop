export const responseUtili = (
    res,
    httpCode = 400,
    status,
    msg,
    others = null
) => {
    let response;
    if (others) {
        response = { status, msg, others };
    } else {
        response = { status, msg };
    }

    return res.status(httpCode).json(response);
};
