import express from "express";
import { userRoutes } from "./user/user.routes.js";
import { sellerRoutes } from "./seller/seller.routes.js";

export function routes() {
    const router = express.Router();
    sellerRoutes(router);
    userRoutes(router);
    return router;
}
