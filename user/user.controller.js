/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 29, 2024
 *
 * Module: Bug Routes
 * Description
 * -----------------------------------------------------------------------------------
 * Controller file to call API routes related to bug analysis.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 29, 2024        Initially Created
 * Yash Pathak       Jan 31, 2024        Added function to get add user and login the user.
 * Yash Pathak       Feb 02, 2024        Added function to get assigned bugs and developer data.
 * Yash Pathak       Feb 08, 2024        Added function to check weather new project is unique or not.
 * Yash Pathak       Feb 14, 2024        Added Function to get count of team leads for a project.
 * -----------------------------------------------------------------------------------
 */

const userService = require("./user.services");
const middleware=require("../common/middleware/GenerateToken");

/**
 * Login admin to application.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.LoginAdmin = async(req,res)=>{
    try {
        let loginResult = await userService.LoginAdmin(req,res);
        loginResult.success = true;
        if(loginResult.success){
        
                let userData = req.body;
                let { username } = userData;
                
                //setting authorization to header field of res object.
                let authorization = await middleware.GenerateToken(username);
                res.setHeader('Authorization', authorization);

                res.status(global.constants.OK).send({ success: loginResult.success,message: loginResult.message});
        }

        else{
            res.status(global.constants.BAD_REQUEST).send({ success: loginResult.success,message: loginResult.message});
        }

    } catch (loginError) {
        logger.error(global.messages.LOGIN_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: loginError.message });
    }
}

/**
 * Get team values of a to show on add user screen.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.GetTeamValues = async(req,res)=>{
    try {
        let result = await userService.GetTeamValues();
        if(result.success){
            res.status(global.constants.OK).send({ success: result.success,message: global.messages.GET_TEAM_SUCCESS, data:result.data });
        }
        else{
            res.status(global.constants.BAD_REQUEST).send({ success: result.success,message: global.messages.GET_TEAM_FAILURE });
        }
       
    } catch (getTeamError) {
        logger.error(global.messages.GET_TEAM_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: getTeamError.message });
    }
}

/**
 * Get project values of a specific team to show on add user screen.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.GetProjectValues = async(req,res)=>{
    try {
        let teamData=req.body.team;

        let projectResult = await userService.GetProjectValues(teamData);
        if(projectResult.success){
            res.status(global.constants.OK).send({ success: projectResult.success,message: global.messages.GET_PROJECT_SUCCESS, data:projectResult.data });
        }
        else{
            res.status(global.constants.BAD_REQUEST).send({ success: projectResult.success,message: global.messages.GET_PROJECT_FAILURE });
        }
       
    } catch (getProjectError) {
        logger.error(global.messages.GET_PROJECT_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: getProjectError.message });
    }
}

/**
 * Add user to the application.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object
 */

exports.AddUser = async(req,res)=>{
    try {
        let addUserResult = await userService.AddUser(req,res);
        if(addUserResult.success){
            res.status(global.constants.OK).send({ success: addUserResult.success,message: global.messages.ADD_USER_SUCCESS });
        }
        else{
            res.status(global.constants.BAD_REQUEST).send({ success: addUserResult.success,message: addUserResult.message});
        }

    } catch (addUserError) {
        logger.error(global.messages.ADD_USER_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: addUserError.message });
    }
}

/**
 * Login user to the application.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.LoginUser = async(req,res)=>{
    try {
        let loginResult = await userService.LoginUser(req,res);

        if(loginResult.success){
        
                let userData = req.body;
                let { userid } = userData;
                let authorization = await middleware.GenerateToken(userid);
                res.setHeader('authorization', authorization);

                res.status(global.constants.OK).send({ success: loginResult.success,message: loginResult.message});
        }
        else{
            res.status(global.constants.BAD_REQUEST).send({ success: loginResult.success,message: loginResult.message});
        }

    } catch (loginError) {
        logger.error(global.messages.LOGIN_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: loginError.message });
    }
}


/**
 * Get developers' data of a specific project.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.GetDeveloperData = async(req,res)=>{
    try {
        let project=req.body.project;

        let developerDataResult = await userService.GetDeveloperData(project);
        if(developerDataResult.success){
            res.status(global.constants.OK).send({ success: developerDataResult.success,message: global.messages.DEV_SUCCESS, data:developerDataResult.data });
        }
        else{
            res.status(global.constants.BAD_REQUEST).send({ success: developerDataResult.success,message: global.messages.DEV_FAILURE});
        }
       
    } catch (addUserError) {
        logger.error(global.messages.DEV_SUCCESS);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: addUserError.message });
    }
}

/**
 * Fetch assigned bugs for a developer.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.FetchAssignedBugs = async(req,res)=>{
    try {
        let tokenData=middleware.DecodeToken(req.body.userToken);

        let developerDataResult = await userService.FetchAssignedBugs(tokenData.data);

        if(developerDataResult.success){
            res.status(global.constants.OK).send({ success: developerDataResult.success,message: global.messages.DEV_SUCCESS, data:developerDataResult.data });
        }
        else{
            res.status(global.constants.BAD_REQUEST).send({ success: developerDataResult.success,message: global.messages.DEV_FAILURE});
        }
       
    } catch (addUserError) {
        logger.error(global.messages.DEV_SUCCESS);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: addUserError.message });
    }
}



/**
 * Check unique project data.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.CheckUniqueProject = async(req,res)=>{
    try {
        let project=req.body.project;

        let uniqueDataResult = await userService.CheckUniqueProject(project);
        if(uniqueDataResult.success){
            res.status(global.constants.OK).send({ success: uniqueDataResult.success,message: global.messages.UNIQUE_PROJECT, data:uniqueDataResult.data });
        }
        else{
            res.status(global.constants.BAD_REQUEST).send({ success: uniqueDataResult.success,message: global.messages.DUPLICATE_PROJECT});
        }
       
    } catch (addUserError) {
        logger.error(global.messages.DUPLICATE_PROJECT);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: addUserError.message });
    }
}


/**
 * Get count of team leads for a project data.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.GetTeamLeadsCount = async(req,res)=>{
    try {
        let project=req.body.project;

        let teamLeadsCount = await userService.GetTeamLeadsCount(project);
        if(teamLeadsCount.success){
            res.status(global.constants.OK).send({ success: teamLeadsCount.success,message: global.messages.TEAM_LEADS_SUCCESS, data:teamLeadsCount.data });
        }
        else{
            res.status(global.constants.BAD_REQUEST).send({ success: teamLeadsCount.success,message: global.messages.TEAM_LEADS_FAILURE});
        }
       
    } catch (getTeamError) {
        logger.error(global.messages.TEAM_LEADS_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: getTeamError.message });
    }
}