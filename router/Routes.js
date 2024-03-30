/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
 *
 * Module: Routes
 * Description
 * -----------------------------------------------------------------------------------
 * This module defines routes to call APIs on the backend for the Bug Analyzer.
 * Contains routes to handle various API endpoints related to bug analysis.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 19, 2024        Initially Created
 * Yash Pathak       Jan 29, 2024        Added routes for user.
 * -----------------------------------------------------------------------------------
 */

let express = require('express');

// Creating an Express router
let router = express.Router();

router.use('/', require('../display'));

// Setting up routes for the '/bugs' endpoint using the 'bugs' module
router.use('/bugs', require('../bugs'));

// Setting up routes for the '/user' endpoint using the 'user' module
router.use('/user',require('../user'));

// Exporting the configured router
module.exports = router;