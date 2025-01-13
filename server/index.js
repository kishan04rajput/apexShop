import "dotenv/config";
import express from "express";
import { routes } from "./routes/router.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { setupFactory } from "./factory/factory.js";
import { setupConfig } from "./config/config.js";

const main = async () => {
    let config = setupConfig();
    if (!(await setupFactory(config))) return;

    const app = express();
    app.use(morgan("combined"));
    app.use(express.json());
    app.use(cookieParser());
    app.use(routes());

    app.listen(4444, () => {
        console.log("Server started on port 4444!");
    });
};

main();
