const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");


console.log = () => {}; // Disable console.log


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


// Create a function that returns the request logging middleware
function requestLogger(req, res, next) {
    // Log request details using the Winston logger
    logger.info(`${req.method} ${req.url}`);
    next(); // Continue with the request
  }



module.exports = {
    logger,
    requestLogger,
};