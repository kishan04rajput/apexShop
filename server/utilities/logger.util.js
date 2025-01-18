import { createLogger, transports, format } from "winston";
import util from "util";
import { getConfig } from "../config/config.js";
const config = getConfig();

const logger = createLogger({
    level: config.loggerLevel, // Set the minimum level of logs to capture
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: "user-service" },
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
        }),
    ],
});

export const logReqResUtil = (req, res, next) => {
    logger.info(
        `Incoming request: ${util.inspect(req, {
            showHidden: false,
            depth: null,
        })}`
    );
    // Create a temporary container to hold the response body
    let responseBody = "";
    // Capture the original send function
    const originalSend = res.send;
    // Override the send function to capture and log response body
    res.send = function (body) {
        responseBody = body;
        // Log the response body
        // logger.info(`Outgoing response body: ${responseBody}`);
        logger.info(
            `Outgoing response body: ${util.inspect(responseBody, {
                showHidden: false,
                depth: null,
            })}`
        );
        return originalSend.apply(this, arguments);
    };
    next();
};

export default logger;

// logger.error("This is an error message");
// logger.warn("This is a warning message");
// logger.info("This is an informational message");
// logger.verbose("This is a verbose message");
// logger.debug("This is a debug message");
// logger.silly("This is a silly message");
