import { getUserFromCache, setUserInCache } from "../cache/user/user.cache.js";
import { getConfiguration } from "../configuration/configuration.js";
import {
    checkIfUserExistsService,
    decodeUserJwtTokenService,
} from "../services/user/user.service.js";
import { handleErrorResponseUtility } from "../utilities/response.util.js";

export const authenticationMiddleware = async (
    request,
    response,
    nextFunction
) => {
    const configuration = getConfiguration();
    const token = request?.headers?.apexshopaccesstoken || null;
    if (!token) {
        return handleErrorResponseUtility(
            response,
            401,
            "failed",
            "Access token missing. Please login!"
        );
    }

    let decodedToken = await decodeUserJwtTokenService(
        token,
        configuration.accessTokenSecret
    );
    if (!decodedToken) {
        return handleErrorResponseUtility(
            response,
            401,
            "failed",
            "Invalid token. Please login again!"
        );
    }

    let { sub } = decodedToken;

    let user = await checkIfUserExistsService(sub);
    if (!user) {
        return handleErrorResponseUtility(
            response,
            404,
            "failed",
            "User not found!"
        );
    }

    request.user = user;
    request.user.email = sub;
    nextFunction();
};
