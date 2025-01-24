export const handleErrorResponseUtility = (
    response,
    httpCode = 400,
    status,
    errorMessage = null
) => {
    let jsonResponse;
    if (errorMessage) {
        jsonResponse = { status, error: errorMessage };
    } else {
        jsonResponse = { status };
    }

    return response.status(httpCode).json(jsonResponse);
};

export const handleSuccessResponseUtility = (
    response,
    httpCode = 400,
    status,
    message,
    data = null
) => {
    let jsonResponse;
    if (data) {
        jsonResponse = { status, message, data };
    } else {
        jsonResponse = { status, message };
    }

    return response.status(httpCode).json(jsonResponse);
};
