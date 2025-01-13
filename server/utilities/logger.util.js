import { createLogger, transports, format } from "winston";

const logger = createLogger({
    level: "silly", // Set the minimum level of logs to capture
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

export default logger;

// logger.error("This is an error message");
// logger.warn("This is a warning message");
// logger.info("This is an informational message");
// logger.verbose("This is a verbose message");
// logger.debug("This is a debug message");
// logger.silly("This is a silly message");
