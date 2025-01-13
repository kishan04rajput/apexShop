import {
    getUserDetailsController,
    loginController,
    signupController,
    userProfileUpdateController,
    userUpdatePassword,
} from "../../controllers.js/user.controller.js";
import { authenticationMiddleware } from "../../middlewares/auth.mw.js";
import express from "express";

export function userRoutes(router) {
    const userRoutes = express.Router();

    userRoutes.post("/signup", signupController);
    userRoutes.post("/login", loginController);
    userRoutes.get(
        "/profile/info",
        authenticationMiddleware,
        getUserDetailsController
    );
    userRoutes.put(
        "/profile/update",
        authenticationMiddleware,
        userProfileUpdateController
    );
    userRoutes.post(
        // TODO: Patch
        "/updatepassword",
        authenticationMiddleware,
        userUpdatePassword
    );
    router.use("/user", userRoutes);
}
