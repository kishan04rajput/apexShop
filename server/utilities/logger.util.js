import { createLogger, transports, format } from "winston";
import util from "util";
import { getConfig } from "../config/config.js";
const config = getConfig();

const customFormat = format.printf(
    ({ level, message, timestamp, service, ...other }) => {
        if (Object.keys(other).length > 0) {
            let otherData = "";
            let otherKeys = Object.keys(other);
            otherKeys.forEach((element) => {
                otherData += `"${element}": "${other[element]}"\n`;
            });
            return `\n{"level": "${level}"\n"message": "${message}"\n"service": "${service}"\n"timestamp": "${timestamp}"\n${otherData}`;
        }
        return `\nLevel: ${level}\nMessage: ${message}\nService: ${service}\nTimestamp: ${timestamp}`;
    }
);

const logger = createLogger({
    level: config.loggerLevel, // Set the minimum level of logs to capture
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
        // customFormat
    ),
    defaultMeta: { service: "user-service" },
    transports: [new transports.Console()],
});

export const logReqResUtil = (req, res, next) => {
    // Create a temporary container to hold the response body
    let responseBody = "";
    // Capture the original send function
    const originalSend = res.send; // Override the send function to capture and log response body
    res.send = function (body) {
        responseBody = body;
        // Log the request and response
        logger.info({
            endpoint: req.url,
            method: req.method,
            headers: req.headers,
            userId: req.user ? req.user.id : "Unknown",
            request: { body: req.body, params: req.params },
            response: { body: responseBody },
            msg: "logging request and response",
        });
        return originalSend.apply(this, arguments);
    };
    next();
    // console.log("\nreq.user = ", req._id);
};

export default logger;

// logger.error("This is an error message");
// logger.warn("This is a warning message");
// logger.info("This is an informational message");
// logger.verbose("This is a verbose message");
// logger.debug("This is a debug message");
// logger.silly("This is a silly message");
