import {
    getUserDetailsController,
    loginController,
    signupController,
    userProfileUpdateController,
    userUpdatePassword,
} from "../../controllers/user/user.controller.js";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";
import express from "express";
import { validateReqMW } from "../../middlewares/validateRequest.middleware.js";
import {
    loginValidationRulesUtil,
    signupValidationRulesUtil,
    updatePasswordValidationRulesUtil,
    updateProfileValidationRulesUtil,
} from "../../utilities/validationRules.util.js";

export function userRoutes(router) {
    const userRoutes = express.Router();

    userRoutes.post(
        "/signup",
        validateReqMW(signupValidationRulesUtil),
        signupController
    );
    userRoutes.post(
        "/login",
        validateReqMW(loginValidationRulesUtil),
        loginController
    );
    userRoutes.get(
        "/profile/info",
        authenticationMiddleware,
        getUserDetailsController
    );
    userRoutes.put(
        "/profile/update",
        validateReqMW(updateProfileValidationRulesUtil),
        authenticationMiddleware,
        userProfileUpdateController
    );
    userRoutes.patch(
        "/updatepassword",
        validateReqMW(updatePasswordValidationRulesUtil),
        authenticationMiddleware,
        userUpdatePassword
    );
    router.use("/user", userRoutes);
}
