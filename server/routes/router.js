import express from "express";
import { userRoutes } from "./user/user.routes.js";

export function routes() {
    const router = express.Router();
    userRoutes(router);
    return router;
}
