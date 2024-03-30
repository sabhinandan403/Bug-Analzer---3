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


let winston = require('winston');

let logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;