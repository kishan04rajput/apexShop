import { createLogger, transports, format } from "winston";
import util from "util";
import { getConfiguration } from "../configuration/configuration.js";
import { header } from "express-validator";
const configuration = getConfiguration();

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
    level: configuration.loggerLevel, // Set the minimum level of logs to capture
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

const deepClone = (object) => {
    return JSON.parse(JSON.stringify(object));
};

export const logRequestResponseUtility = (request, response, nextFunction) => {
    let responseBody = "";
    const originalSend = response.json;
    response.json = function (body) {
        responseBody = body;
        response.on("finish", () => {
            const responseHeaders = deepClone(response.getHeaders());
            logger.info({
                endpoint: request.url,
                method: request.method,
                userId: request.user ? request.user.id : "Unknown",
                request: {
                    body: request.body,
                    params: request.params,
                    headers: request.headers,
                },
                response: {
                    body: responseBody,
                    header: responseHeaders,
                },
                msg: "logging request and response",
            });
        });
        return originalSend.apply(this, arguments);
    };
    nextFunction();
};

export default logger;

// logger.error("This is an error message");
// logger.warn("This is a warning message");
// logger.info("This is an informational message");
// logger.verbose("This is a verbose message");
// logger.debug("This is a debug message");
// logger.silly("This is a silly message");
