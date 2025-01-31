import {
    getSellerDetailsController,
    updateSellerProfileController,
    updateSellerPasswordController,
    signupSellerController,
    loginSellerController,
} from "../../controllers/seller/seller.controller.js";
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

export function sellerRoutes(router) {
    const configuration = getConfiguration();
    const sellerRouter = express.Router();

    sellerRouter.post(
        "/signup",
        validateRequestMiddleware(signupValidationRulesUtility),
        signupSellerController
    );
    sellerRouter.post(
        "/login",
        validateRequestMiddleware(loginValidationRulesUtility),
        loginSellerController
    );
    sellerRouter.get(
        "/profile/info",
        authenticationMiddleware(configuration.sellerAccessTokenSecretKey),
        getSellerDetailsController
    );
    sellerRouter.put(
        "/profile/update",
        validateRequestMiddleware(updateProfileValidationRulesUtility),
        authenticationMiddleware(configuration.sellerAccessTokenSecretKey),
        updateSellerProfileController
    );
    sellerRouter.patch(
        "/updatepassword",
        validateRequestMiddleware(updatePasswordValidationRulesUtility),
        authenticationMiddleware(configuration.sellerAccessTokenSecretKey),
        updateSellerPasswordController
    );
    router.use("/seller", sellerRouter);
}
