/**
 * @module logger
 * 
 * @summary Sets up a custom logging set up to catpure console logs and errors to an external file
 * 
 * @overview In this file Winston is set up.
 * 
 * It captures console logs and errors, and stores it in /logs.
 * 
 * It is set up to rotate so that logs are stored in a seperate file each day.
 * The logger will hold on to log files for up to 31 days.
 * 
 * console.log is disabled to prevent double logging.
 */


/** Imports */
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");


/** Disable console.log */
console.log = () => {}; 


/** Set up winston with a rotate file for combined logs, and one for errors */
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            filename: "./logs/%DATE%/combined.log",
            datePattern: "YYY-MM-DD",
            zippedArchive: true,
            maxSize: "50m", // Max log file size
            maxFiles: "31d", // Max log files to keep (31 days)
        }),
        new DailyRotateFile({
            filename: "./logs/%DATE%/error.log",
            datePattern: "YYY-MM-DD",
            level: "error",
            zippedArchive: true,
            maxSize: "50m", // Max log file size
            maxFiles: "31d", // Max log files to keep (31 days)
        })
    ],
});



// Intercept and redirect console.log to the custom logger
const originalConsoleLog = console.log;
console.log = (...args) => {
    logger.info(...args);
    originalConsoleLog(...args);
};

// Intercept and redirect console.error to the custom logger
const originalConsoleError = console.error;
console.error = (...args) => {
    logger.error(...args);
    originalConsoleError(...args);
};


/**
 * @function requestLogger
 * @summary enables express to use the logger via app.use(logger)
 */
function requestLogger(req, res, next) {
    // Log request details using the Winston logger
    logger.info(`${req.method} ${req.url}`);
    next(); // Continue with the request
  }


/** Export the logger and requestLogger */
module.exports = {
    logger,
    requestLogger,
};