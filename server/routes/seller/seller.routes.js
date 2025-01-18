import {
    getSellerDetailsController,
    loginController,
    signupController,
    sellerProfileUpdateController,
    sellerUpdatePassword,
} from "../../controllers.js/seller/seller.controller.js";
import { authenticationMiddleware } from "../../middlewares/auth.mw.js";
import express from "express";
import { validateReqMW } from "../../middlewares/validateReq.mw.js";
import {
    loginValidationRulesUtil,
    signupValidationRulesUtil,
    updatePasswordValidationRulesUtil,
    updateProfileValidationRulesUtil,
} from "../../utilities/validationRules.util.js";

export function sellerRoutes(router) {
    const sellerRoutes = express.Router();

    sellerRoutes.post(
        "/signup",
        validateReqMW(signupValidationRulesUtil),
        signupController
    );
    sellerRoutes.post(
        "/login",
        validateReqMW(loginValidationRulesUtil),
        loginController
    );
    sellerRoutes.get(
        "/profile/info",
        authenticationMiddleware,
        getSellerDetailsController
    );
    sellerRoutes.put(
        "/profile/update",
        validateReqMW(updateProfileValidationRulesUtil),
        authenticationMiddleware,
        sellerProfileUpdateController
    );
    sellerRoutes.patch(
        "/updatepassword",
        validateReqMW(updatePasswordValidationRulesUtil),
        authenticationMiddleware,
        sellerUpdatePassword
    );
    router.use("/seller", sellerRoutes);
}
