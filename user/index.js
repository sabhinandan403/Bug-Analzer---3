/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 29, 2024
 *
 * Module: User Routes
 * Description
 * -----------------------------------------------------------------------------------
 * Index file to call API routes related to user.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 29, 2024        Initially Created
 * Yash Pathak       Jan 31, 2024        Added API to get add user and login the user.
 * Yash Pathak       Feb 02, 2024        Added API to get assigned bugs and developer data.
 * Yash Pathak       Feb 09, 2024        API to get the check unique project.
 * Yash Pathak       Feb 14, 2024        Added Function to get count of team leads for a project.
 * -----------------------------------------------------------------------------------
 */


let Express = require('express');
let router = Express.Router();
let userController = require("./user.controller");

//API to login the admin in the application.
router.post('/login', userController.LoginAdmin);

//API to populate team values in dropdown in add User page.
router.get('/teamName', userController.GetTeamValues);

//API to populate project values in dropdown.
router.post('/getProjectValues', userController.GetProjectValues);

//API to add user in the application.
router.post('/addUser', userController.AddUser);

//API to login the user.
router.post('/userLogin', userController.LoginUser);

//API to get the developer data.
router.post('/developerData',userController.GetDeveloperData)

//API to get the assigned bugs 
router.post('/assignedBugs',userController.FetchAssignedBugs)

//API to get the check unique project
router.post('/checkUniqueProject',userController.CheckUniqueProject)

//API to get count of team leads of a project
router.post('/getTeamLeadsCount',userController.GetTeamLeadsCount)

module.exports = router;