/**
 * Project Name : Bug Analyzer
 * @Project Bug Analyzer
 * @author  Yash Pathak
 * @date    Jan 20, 2024 
 * 
 * Module: Logger
 * Description
 * ----------------------------------------------------------------------------------- 
 * Contains logger functions to log incoming messages.
 * 
 * -----------------------------------------------------------------------------------
 * 
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Yash Pathak          Jan 20, 2024        Initially Created
 * -----------------------------------------------------------------------------------
 */


const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file");
const logFileName = "BugAnalysis";
const logFileExtension = ".log";
const logDirectory = "logs";
const dateFormat = "YYYY-MM-DD";
const logType = "Analysis";
const threadName = "NoName";
const threadNumber = 1;
const increment_value = 1;
let filteredStack;
let loggerFileName = "";
let loggerFunctionName = "";
let loggerLineNumber = "";

//Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format : "YYYY-MM-DD HH:mm:ss.SSS"
  }),
  winston.format.printf(
    (info) =>
      `${
        info.timestamp
      },${logType},${info.level.toUpperCase()},${loggerFileName},${threadName},${threadNumber},${loggerFunctionName},${loggerLineNumber},${
        info.message
      }`
  )
);

//initializing winston logger options
var transport = new winston.transports.DailyRotateFile({
  filename : "%DATE%-" + logFileName, //File name pattern to be made
  dirname : logDirectory, //Directory to store log files
  datePattern : dateFormat,
  zippedArchive : false, //Option for archeving the log files
  maxSize : 10000000, //Maximum size for log file partition
  maxFiles : 10, //Remove files based on no. of days or no. of files
  extension : logFileExtension,
  handleExceptions : true
});

//creating logger instance
var logger = winston.createLogger({
  format : logFormat,
  transports : [transport]
});

/**
 * utils/WinstonLogger
 * @module
 */
module.exports = {
  /**
   * Function to fetch the FileName, FunctionName and LineNumber correponding to the callee and log in the required format
   * @param {string} level - error, info, debug
   * @param {string} message
   */
  Log : (level, message) => {
    //exploring the stack trace for fetching the FileName, FunctionName and LineNumber
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
      return stack;
    };
    var err = new Error();
    //removing internal functions/files from stack trace as they are not required to be logged
    filteredStack = err.stack.filter(
      (element) =>
        element.getFileName() != null &&
        !(
          element.getFileName().includes("node:internal") &&
          element.getFileName().includes("node_modules")
        )
    );

    let i = 1; //used to refer to first index of the filteredStack asthe details of the calling function are present on the first index

    Error.prepareStackTrace = orig;
    loggerFileName = path.basename(filteredStack[i].getFileName());
    loggerLineNumber = filteredStack[i].getLineNumber();
    //In some cases the functionName might be null at the first index of the filteredStack array (in cases where the logging is done inside a Promise function instead of a normal function)
    //So, picking the functionName from the second index in those cases
    loggerFunctionName =
      filteredStack[i].getFunctionName() != null
        ? filteredStack[i].getFunctionName()
        : filteredStack[i + increment_value].getFunctionName();
    message = loggerFunctionName + message;
    //generating log
    logger.log(level, message);
  }
};
