/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
 *
 * Module: Bug Routes
 * Description
 * -----------------------------------------------------------------------------------
 * Index file to call API routes related to bug analysis.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 19, 2024        Initially Created
 * Yash Pathak       Jan 19, 2024        Added API to add new bug.
 * Yash Pathak       Jan 20, 2024        Added API to get data of all bugs.
 * Yash Pathak       Jan 21, 2024        Added API to get data of project specific bugs.
 * Yash Pathak       Jan 23, 2024        Added API to get fields data for registered bugs form.
 * Yash Pathak       Jan 31, 2024        Added API to Edit spefific bug data.
 * Yash Pathak       Feb 02, 2024        Added API to retrieve spefific bug data and to retrieve all bug details of a team.
 * -----------------------------------------------------------------------------------
 */

let express = require('express');
let router = express.Router();
let bugsController = require("./bugs.controller");


//API to get data of Project Name.
router.post('/projectName', bugsController.GetProjectName);

//API to get default bug data.
router.get('/defaultBugData', bugsController.GetDefaultBugData);



// API to add new Bug inside application.
router.post('/registerBug', bugsController.AddBugInfo);

//API to get data of all bugs.
router.post('/allBugsData', bugsController.GetBugData);

//API to get data of project specific bugs.
router.post('/projectBugsData', bugsController.GetProjectBugsData);

//API to get get a specific bug to show on update bug screen.
router.post('/getSpecificBugData', bugsController.GetSpecificBugsData)



//API to get edit a specific bug.
router.post('/editBug', bugsController.EditBug);

//API to check a unique bug.
router.post('/uniqueBug', bugsController.CheckUniqueBug);


// Export the configured router
module.exports = router;