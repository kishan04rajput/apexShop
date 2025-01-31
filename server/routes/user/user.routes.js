import {
    getUserDetailsController,
    loginUserController,
    signupUserController,
    updateUserProfileController,
    updateUserPasswordController,
} from "../../controllers/user/user.controller.js";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";
import express from "express";
import { validateRequestMiddleware } from "../../middlewares/validateRequest.middleware.js";
import {
    loginValidationRulesUtility,
    signupValidationRulesUtility,
    updatePasswordValidationRulesUtility,
    updateProfileValidationRulesUtility,
} from "../../utilities/validationRules.util.js";
import { getConfiguration } from "../../configuration/configuration.js";

export function userRoutes(router) {
    const configuration = getConfiguration();
    const userRouter = express.Router();

    userRouter.post(
        "/signup",
        validateRequestMiddleware(signupValidationRulesUtility),
        signupUserController
    );
    userRouter.post(
        "/login",
        validateRequestMiddleware(loginValidationRulesUtility),
        loginUserController
    );
    userRouter.get(
        "/profile/info",
        authenticationMiddleware(configuration.userAccessTokenSecretKey),
        getUserDetailsController
    );
    userRouter.put(
        "/profile/update",
        validateRequestMiddleware(updateProfileValidationRulesUtility),
        authenticationMiddleware(configuration.userAccessTokenSecretKey),
        updateUserProfileController
    );
    userRouter.patch(
        "/updatepassword",
        validateRequestMiddleware(updatePasswordValidationRulesUtility),
        authenticationMiddleware(configuration.userAccessTokenSecretKey),
        updateUserPasswordController
    );
    router.use("/user", userRouter);
}
