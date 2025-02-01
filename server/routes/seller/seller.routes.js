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
    const sellerRouter = express.Router();

    publicSellerRoutes(sellerRouter);
    protectedSellerRoutes(sellerRouter);

    router.use("/seller", sellerRouter);
}

const publicSellerRoutes = (sellerRouter) => {
    let publicSellerRouter = express.Router();
    publicSellerRouter.post(
        "/signup",
        validateRequestMiddleware(signupValidationRulesUtility),
        signupSellerController
    );
    publicSellerRouter.post(
        "/login",
        validateRequestMiddleware(loginValidationRulesUtility),
        loginSellerController
    );
    sellerRouter.use("", publicSellerRouter);
};

const protectedSellerRoutes = (sellerRouter) => {
    const configuration = getConfiguration();
    let protectedSellerRouter = express.Router();

    protectedSellerRouter.get("/profile/info", getSellerDetailsController);
    protectedSellerRouter.put(
        "/profile/update",
        validateRequestMiddleware(updateProfileValidationRulesUtility),
        updateSellerProfileController
    );

    protectedSellerRouter.patch(
        "/updatepassword",
        validateRequestMiddleware(updatePasswordValidationRulesUtility),
        updateSellerPasswordController
    );
    sellerRouter.use(
        "",
        authenticationMiddleware(configuration.sellerAccessTokenSecretKey),
        protectedSellerRouter
    );
};
