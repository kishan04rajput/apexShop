import { getUserFromCache, setUserInCache } from "../cache/user/user.cache.js";
import {
    checkIfUserExistSvc,
    decodeUserJwtTokenSvc,
} from "../services/user/user.svc.js";

export const authenticationMiddleware = async (req, res, next) => {
    const cookieValue = req?.cookies?.ApexShopAccessToken;
    if (!cookieValue) {
        return res.status(404).send("Please Login!");
    }
    let { email } = await decodeUserJwtTokenSvc(
        cookieValue,
        process.env.ACCESS_TOKEN_SECRET
    );
    if (!email) {
        return res.status(404).send("User Not Found!");
    }

    let user = await getUserFromCache(email);
    if (!user) {
        user = await checkIfUserExistSvc(email);
        if (!user) {
            return res.status(404).send("User not found!");
        }

        await setUserInCache(user);
    }

    req.user = user;
    req.user.email = email;
    next();
};
