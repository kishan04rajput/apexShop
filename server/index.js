import "dotenv/config";
import express from "express";
import { routes } from "./routes/router.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { setupFactory } from "./factory/factory.js";
import { setupConfig } from "./config/config.js";
import logger, { logReqResUtil } from "./utilities/logger.util.js";

const main = async () => {
    let config = setupConfig();
    if (!(await setupFactory(config))) return;

    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    // app.use(morgan("combined"));
    app.use((req, res, next) => logReqResUtil(req, res, next));
    app.use(routes());

    app.listen(4444, () => {
        logger.info(`Server started on port 4444!`, "asdsad", { port: 4444 }, [
            "bdfsdf",
            "sdfsdf",
        ]);
    });
};

main();
