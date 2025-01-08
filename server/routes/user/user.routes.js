import {
    getUserDetailsController,
    loginController,
    signupController,
    userProfileUpdateController,
    userUpdatePassword,
} from "../../controllers.js/user.controller.js";
// import express from "express";

export function userRoutes(router) {
    // router.use("/user", router);
    // const router = express.Router();
    router.post("/user/signup", signupController);
    router.post("/user/login", loginController);
    router.get("/user/getinfo", getUserDetailsController);
    router.put("/user/profile/update", userProfileUpdateController);
    router.post("/user/updatepassword", userUpdatePassword);
}
