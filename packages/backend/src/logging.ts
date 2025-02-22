import morgan from "morgan";
import winston from "winston";
import chalk from "chalk";

const logFolder = "./logs";
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        //
        // Write all logs with importance level of error or higher to error.log
        //   (i.e., error, fatal, but not other levels)
        //
        new winston.transports.File({
            filename: `${logFolder}/error.log`,
            level: "error",
        }),
        //
        // Write all logs with importance level of info or higher to combined.log
        //   (i.e., fatal, error, warn, and info, but not trace)
        //
        new winston.transports.File({
            filename: `${logFolder}/activity.log`,
            level: "info",
        }),
    ],
});

// Logs to console, colour printed
const consoleLogger = morgan(
    // Custom output format
    (tokens, req, res) => {
        const status = Number(tokens.status(req, res));

        // Check if status is an error code
        let statusCode: string;
        if (Number.isNaN(status) || status >= 400) {
            statusCode = chalk.red.bold(tokens.status(req, res));
        } else {
            statusCode = chalk.green.bold(tokens.status(req, res));
        }

        return [
            "[server]:",
            chalk.yellow(tokens.method(req, res)),
            statusCode,
            chalk.white(tokens.url(req, res)),
            chalk.yellow(tokens["response-time"](req, res) + " ms"),
        ].join(" ");
    }
);

// Logs to activity.log file, timestamped json format
const activityLogger = morgan("tiny", {
    stream: { write: (message) => logger.info(message) },
});

export { consoleLogger, activityLogger, logger };
