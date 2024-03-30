/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 29, 2024
 *
 * Module: Bug Routes
 * Description
 * -----------------------------------------------------------------------------------
 * Services file to call API routes related to bug analysis.
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
 * Yash Pathak       Feb 16, 2024        Modified function to add user for a project.
 * -----------------------------------------------------------------------------------
 */

let dbService = require("../common/db/DbService");
let userMapper = require('../common/mapper/Mapper');
let FormValidator=require("../common/validator/FormValidator");

/**
 * Service layer function to get login admin.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the login process.
 */
exports.LoginAdmin=async (req,res) => {
    try {
        let userMap = await userMapper.LoginHashmap(req.body,req);
        let loginResult = await dbService.LoginAdmin(userMap);
        return loginResult;
    } catch (userLoginError) {
        throw userLoginError;
    }
}

/**
 * Service layer function to get team values.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the process.
 */

exports.GetTeamValues=async(req,res) => {
    try{
    let result = await dbService.GetTeamValues();
        return result;
    } catch (getTeamError) {
        throw getTeamError;
    }
}

/**
 * Service layer function to get project values for a specific team.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the process.
 */

exports.GetProjectValues=async(teamData) => {
    try{
    let projectResult = await dbService.GetProjectValues(teamData);
        return projectResult;
    } catch (getProjectError) {
        throw getProjectError;
    }
}

/**
 * Service layer function to add user.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the process.
 */

exports.AddUser=async (req,res) => {
    try {
        let UserData=req.body.payload;

        if(UserData.category==global.dbvalues.TEAM_LEAD){

        if(UserData.projects.length>global.constants.MAX_LIMIT){
            return { success: false,message: global.messages.TEAM_MAX_ERROR};
        }

        for(let project of UserData.projects){
        let getTeamLeads = await dbService.GetTeamLeadsCount(project);

        if(getTeamLeads.success){
            if(getTeamLeads.data.length >= global.constants.MAX_LIMIT) return { success: false,message: global.messages.TEAM_LEAD_MAX_ERROR};
        }
        }
        }

        let userMap = await userMapper.MakeUserMap(UserData);
        let result = await dbService.AddUser(userMap,req);
        return result;
    } catch (addUserError) {
        throw addUserError;
    }
}


/**
 * Service layer function to get login user.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the login process.
 */
exports.LoginUser=async (req,res) => {
    try {
        let userMap = await userMapper.LoginHashmap(req.body,req);
        let result = await dbService.LoginUser(userMap,req);
        return result;
    } catch (userLoginError) {
        throw userLoginError;
    }
}

/**
 * Service layer function to get developers' data of a specific project.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the process.
 */

exports.GetDeveloperData=async(project) => {
    try{
    let devResult = await dbService.GetDeveloperData(project);
        return devResult;
    } catch (getDevError) {
        throw getDevError;
    }
}

/**
 * Service layer function to fetch assigned bugs for a developer.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the process.
 */

exports.FetchAssignedBugs=async(userData) => {
    try{
    let assignedBugs = await dbService.FetchAssignedBugs(userData);
        return assignedBugs;
    } catch (bugsError) {
        throw bugsError;
    }
}


/**
 * Service layer function to check project entered is unique or not.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the process.
 */

exports.CheckUniqueProject=async(project) => {
    try{
    let uniqueProject = await dbService.CheckUniqueProject(project);
        return uniqueProject;
    } catch (uniqueProjectError) {
        throw uniqueProjectError;
    }
}


/**
 * Service layer function to get count of team leads for a project.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the process.
 */

exports.GetTeamLeadsCount=async(project) => {
    try{
    let getTeamLeads = await dbService.GetTeamLeadsCount(project);
        return getTeamLeads;
    } catch (getTeamLeadsError) {
        throw getTeamLeadsError;
    }
}