import { getUserFromCache, setUserInCache } from "../cache/user/user.cache.js";
import { getConfig } from "../config/config.js";
import {
    checkIfUserExistSvc,
    decodeUserJwtTokenSvc,
} from "../services/user/user.svc.js";
import { handleErrorResUtil } from "../utilities/response.util.js";
const config = getConfig();

export const authenticationMiddleware = async (req, res, next) => {
    const token = req?.headers?.apexshopaccesstoken || null;
    if (!token) {
        return handleErrorResUtil(res, 404, "failed", "Please Login!");
    }

    let response = await decodeUserJwtTokenSvc(token, config.accessTokenSecret);
    if (!response) {
        return handleErrorResUtil(res, 404, "failed", "Please login again!");
    }

    let { email } = response;

    let user = await checkIfUserExistSvc(email);
    if (!user) {
        return handleErrorResUtil(res, 404, "failed", "User Not Found!");
    }

    req.user = user;
    req.user.email = email;
    next();
};
