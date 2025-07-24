import morgan from "morgan";
import winston from "winston";
import pc from "picocolors";
import config from "@cooper/backend/serverConfig.json";

const logFolder = config.logFolder ?? "./logs";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    /**
     * Write all logs with importance level of error or higher to error.log
     * (i.e., error, fatal, but not other levels)
     */
    new winston.transports.File({
      filename: `${logFolder}/error.log`,
      level: "error",
    }),
    /**
     * Write all logs with importance level of info or higher to combined.log
     * (i.e., fatal, error, warn, and info, but not trace)
     */
    new winston.transports.File({
      filename: `${logFolder}/activity.log`,
      level: "info",
    }),
  ],
});

/**
 * Logger that prints to console with colour
 */
const consoleLogger = morgan(
  // Custom output format
  (tokens, req, res) => {
    const status = Number(tokens.status(req, res));

    // Check if status is an error code
    let statusCode: string;
    if (Number.isNaN(status) || status >= 400) {
      // Red if >= 400
      statusCode = pc.red(pc.bold(tokens.status(req, res)));
    } else {
      // Green for 200-300
      statusCode = pc.green(pc.bold(tokens.status(req, res)));
    }

    return [
      "[server]:",
      pc.yellow(tokens.method(req, res)),
      statusCode,
      pc.white(tokens.url(req, res)),
      pc.yellow(tokens["response-time"](req, res) + " ms"),
    ].join(" ");
  },
);

/**
 * Logger that logs to file activity.log on disk in timestamped json format
 */
const activityLogger = morgan("tiny", {
  stream: { write: (message) => logger.info(message) },
});

export { consoleLogger, activityLogger, logger };
