import { getUserFromCache, setUserInCache } from "../cache/user/user.cache.js";
import {
    checkIfUserExistSvc,
    decodeUserJwtTokenSvc,
} from "../services/user/user.svc.js";
import { handleErrorResUtil } from "../utilities/handleErrorRes.util.js";

export const authenticationMiddleware = async (req, res, next) => {
    const token = req?.headers?.apexshopaccesstoken || null;
    if (!token) {
        return handleErrorResUtil(res, 404, "failed", "Please Login!");
    }

    let { email } = await decodeUserJwtTokenSvc(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );
    if (!email) {
        return handleErrorResUtil(res, 404, "failed", "User Not Found!");
    }

    let user = await checkIfUserExistSvc(email);
    if (!user) {
        return handleErrorResUtil(res, 404, "failed", "User Not Found!");
    }

    req.user = user;
    req.user.email = email;
    next();
};
