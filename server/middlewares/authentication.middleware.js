import { getUserFromCache, setUserInCache } from "../cache/user/user.cache.js";
import { getConfiguration } from "../configuration/configuration.js";
import {
    checkIfUserExistsService,
    decodeUserJwtTokenService,
} from "../services/user/user.service.js";
import { handleErrorResponseUtility } from "../utilities/response.util.js";
const configuration = getConfiguration();

export const authenticationMiddleware = async (
    request,
    response,
    nextFunction
) => {
    const token = request?.headers?.apexshopaccesstoken || null;
    if (!token) {
        return handleErrorResponseUtility(
            response,
            404,
            "failed",
            "Please Login!"
        );
    }

    let decodedToken = await decodeUserJwtTokenService(
        token,
        configuration.accessTokenSecret
    );
    if (!decodedToken) {
        return handleErrorResponseUtility(
            response,
            404,
            "failed",
            "Please login again!"
        );
    }

    let { sub } = decodedToken;

    let user = await checkIfUserExistsService(sub);
    if (!user) {
        return handleErrorResponseUtility(
            response,
            404,
            "failed",
            "User Not Found!"
        );
    }

    request.user = user;
    request.user.email = sub;
    nextFunction();
};
