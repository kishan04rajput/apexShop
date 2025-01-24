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

export function sellerRoutes(router) {
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
        authenticationMiddleware,
        getSellerDetailsController
    );
    sellerRouter.put(
        "/profile/update",
        validateRequestMiddleware(updateProfileValidationRulesUtility),
        authenticationMiddleware,
        updateSellerProfileController
    );
    sellerRouter.patch(
        "/updatepassword",
        validateRequestMiddleware(updatePasswordValidationRulesUtility),
        authenticationMiddleware,
        updateSellerPasswordController
    );
    router.use("/seller", sellerRouter);
}
