import { getUserFromCache, setUserInCache } from "../cache/user/user.cache.js";
import {
    checkIfUserExistSvc,
    decodeUserJwtTokenSvc,
} from "../services/user/user.svc.js";
import { responseUtili } from "../utilities/response.utilis.js";

export const authenticationMiddleware = async (req, res, next) => {
    const token = req?.headers?.apexshopaccesstoken || null;
    if (!token) {
        return responseUtili(res, 404, "failed", "Please Login!", "No Token!");
    }

    let { email } = await decodeUserJwtTokenSvc(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );
    if (!email) {
        return responseUtili(res, 404, "failed", "User Not Found!");
    }

    let user = await checkIfUserExistSvc(email);
    if (!user) {
        return responseUtili(res, 404, "failed", "User Not Found!");
    }

    req.user = user;
    req.user.email = email;
    next();
};
