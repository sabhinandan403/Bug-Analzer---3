/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @description Entry point for the Bug Analyzer backend server.
 * @author Yash Pathak
 * @date Jan 19, 2024
 *
 * Description
 * -----------------------------------------------------------------------------------
 * This file serves as the main entry point for the Bug Analyzer.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 19, 2024        Initially Created
 *
 * -----------------------------------------------------------------------------------
 */

const express = require('express');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./router/Routes');

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

require('dotenv').config();

// Global variables
global.log = require("./utils/Logger").Log;
global.logger = require('./common/logger/MessageLogger');

global.messages = require('./common/messages/Messages');
global.constants = require('./common/config/Constants');
global.language = require('./locales/en');
global.dbvalues=require('./common/config/DbValues')

const port = process.env.PORT;

// Parsing JSON in request body
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

// Using the defined router
app.use(router);

// Start the server and listen on the specified port
app.listen(port, () => {
    logger.info(`${language.application_listening}${port}`);
});