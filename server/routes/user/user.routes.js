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

export function userRoutes(router) {
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
        authenticationMiddleware,
        getUserDetailsController
    );
    userRouter.put(
        "/profile/update",
        validateRequestMiddleware(updateProfileValidationRulesUtility),
        authenticationMiddleware,
        updateUserProfileController
    );
    userRouter.patch(
        "/updatepassword",
        validateRequestMiddleware(updatePasswordValidationRulesUtility),
        authenticationMiddleware,
        updateUserPasswordController
    );
    router.use("/user", userRouter);
}
