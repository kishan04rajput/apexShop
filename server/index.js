import "dotenv/config";
import express from "express";
import { setupRoutes } from "./routes/router.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { setupFactory } from "./factory/factory.js";
import { setupConfiguration } from "./configuration/configuration.js";
import logger, { logRequestResponseUtility } from "./utilities/logger.util.js";

const main = async () => {
    let configuration = setupConfiguration();
    if (!(await setupFactory(configuration))) return;

    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(morgan("combined"));
    // app.use((request, response, nextFunction) =>
    //     logRequestResponseUtility(request, response, nextFunction)
    // );
    app.use(setupRoutes());

    app.listen(4444, () => {
        // logger.info(`Server started on port 4444!`, "asdsad", { port: 4444 }, [
        //     "bdfsdf",
        //     "sdfsdf",
        // ]);
        logger.info(`Server started on port 4444!`);
    });
};

main();
