/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
 *
 * Module: Database
 * Description
 * -----------------------------------------------------------------------------------
 * Contains the functions to add, show, and modify data in the Database.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 19, 2024        Initially Created
 * Yash Pathak       Jan 19, 2024        Added function to call database function to add new bug.
 * Yash Pathak       Jan 20, 2024        Added function to call database function to get data of all bugs.
 * Yash Pathak       Jan 21, 2024        Added function to call database function to get data of project specific bugs.
 * Yash Pathak       Jan 23, 2024        Added function to get fields data for registered bugs form.
 * Yash Pathak       Jan 29, 2024        Added function to check if user exits and user is unique.
 * Yash Pathak       Feb 01, 2024        Added function to get bug details grouped by project from the database for a specific project.
 * Yash Pathak       Feb 02, 2024        Added function to update bug data.
 * Yash Pathak       Feb 05, 2024        Updated a function which adds a user to the specified table based on the user map and request information.
 * Yash Pathak       Feb 06, 2024        Updated a function which Retrieves project names from the 'project_master' table.
 * Yash Pathak       Feb 08, 2024        Added function to check weather new project is unique or not.
 * Yash Pathak       Feb 14, 2024        Added Function to get count of team leads for a project.
 * -----------------------------------------------------------------------------------
 */

let dbTemplate = require("../db/DbTemplate");
let userMapper = require('../mapper/Mapper');

/**
 * Login a user based on the provided user map.
 * @param {Object} userMap - User information for authentication.
 * @returns {Object} - Authentication result.
 * @throws {Error} - If an error occurs during the authentication process.
 */

exports.LoginAdmin = async (userMap) => {
    try {
        logger.info(global.messages.LOGIN_USER)
        let tableName=global.dbvalues.ADMIN_MASTER;
        let fields=String();

        let loginResult = await dbTemplate.LoginUser(tableName, fields,userMap);
        return loginResult;
    } catch (userLoginError) {
        logger.error(global.messages.GET_TABLE_DATA_FAILURE,userLoginError);
        throw userLoginError;
    }
};


/**
 * Retrieves team values for a specific project from the 'team_master' table.
 * @returns {Object} - An Object containing team values for the specified project.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.GetTeamValues=async()=>{
    try{
       let fields=String();
       let tableName=global.dbvalues.TEAM_MASTER;
       let condition=String();

        let result = await dbTemplate.GetTableData(tableName,fields,condition);

        return result;
    } catch (getTeamError) {
        logger.error(global.messages.GET_TABLE_DATA_FAILURE, getTeamError);
        throw getTeamError;
    }
}

/**
 * Retrieves project values for a specific project from the 'project_master' table.
 * @param {string} team - The name of the team.
 * @returns {Object} - An Object containing project values for the specified team.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.GetProjectValues=async(teamData)=>{
    try{
       let fields=String();
       let tableName=global.dbvalues.PROJECT_MASTER;
       let condition = `team='${teamData}'`;

       let projectResult = await dbTemplate.GetTableData(tableName, fields,condition);

       return projectResult;
    } catch (getTeamError) {
        logger.error(global.messages.GET_TABLE_DATA_FAILURE, getTeamError);
        throw getTeamError;
    }
}

/**
 * Adds a user to the specified table based on the user map and request information.
 * @param {Object} userMap - User information to be added.
 * @param {Object} req - Express request object.
 * @returns {Object} - Result of the user addition operation.
 * @throws {Error} - If an error occurs during the user addition process.
 */

exports.AddUser = async (userMap,req) => {
    try {

        logger.info(global.messages.ADDING_USER)

        let category=req.body.payload.category;
        let tableName=String();
        let fields=String();

        let uniqueUserCheck=await dbTemplate.CheckUniqueUser(userMap,category,fields);
        
        if(uniqueUserCheck){
        //TEAM LEAD
        if(category===global.dbvalues.TEAM_LEAD){
            tableName=global.dbvalues.PROJECT_MASTER;

            let projectArr=userMap.get("projects");
            userMap.delete("projects");
            let result;

            //If all projects are uniue
            for (let project of projectArr) {
                
                // Assuming fields is an array of fields you want to insert
                userMap.set("project", project);
                // Assuming dbTemplate.InsertToDb returns a promise
                  result = await dbTemplate.InsertToDb(tableName, userMap, fields);
            }
            return result;
        } 
        
        //PROJECT MANAGER
        else if(category===global.dbvalues.PROJECT_MANAGER){

        if(userMap.get("project")){
            //Check weather project name is unique or not.
            let fields=`project`;
            let condition=`project='${userMap.get("project")}'`;

            let getProjectData=await dbTemplate.GetTableData(global.dbvalues.PROJECT_MASTER,fields,condition);

            if(getProjectData.success){
                return { success: false, message: global.messages.PROJECT_EXISTS}
            }

            tableName=global.dbvalues.TEAM_MASTER;
            fields=String();
            
            let teamMap= await userMapper.GetTeamMap(userMap);
            let teamResult = await dbTemplate.InsertToDb(tableName,teamMap,fields);

            tableName=global.dbvalues.PROJECT_MASTER;
            let projectMap= await userMapper.GetProjectMap(userMap);
            
            let projectResult = await dbTemplate.InsertToDb(tableName,projectMap,fields);

            if(teamResult.success && projectResult.success){
                return projectResult;
            }
        }
        
        else{
        tableName=global.dbvalues.TEAM_MASTER;
        let result = await dbTemplate.InsertToDb(tableName,userMap,fields);
        return result;
        }
        }
        else if(category===global.dbvalues.TESTER){
            tableName=global.dbvalues.TESTER_MASTER_TABLE;
            let result = await dbTemplate.InsertToDb(tableName,userMap,fields);
            return result;
        }
        //DEVELOPER
        else{ 
        tableName=global.dbvalues.DEVELOPER_MASTER;
        let result = await dbTemplate.InsertToDb(tableName,userMap,fields);
        return result;
        }
        }
        
        else{
        let result= { success: false, message: global.messages.USER_EXISTS }
        return result;
        }
    } catch (addUserError) {
        logger.error(global.messages.GET_TABLE_DATA_FAILURE,addUserError);
        throw addUserError;
    }
};

/**
 * Login a user based on the provided user map.
 * @param {Object} userMap - User information for authentication.
 * @returns {Object} - Authentication result.
 * @throws {Error} - If an error occurs during the authentication process.
 */

exports.LoginUser = async (userMap,req) => {
    try {

        logger.info(global.messages.LOGIN_USER)
        let category=req.body.category;
        let tableName=String();
        
        if(category===global.dbvalues.TEAM_LEAD) tableName=global.dbvalues.PROJECT_MASTER;
        else if(category===global.dbvalues.PROJECT_MANAGER) tableName=global.dbvalues.TEAM_MASTER;
        else if(category===global.dbvalues.TESTER) tableName=global.dbvalues.TESTER_MASTER_TABLE;
        else tableName=global.dbvalues.DEVELOPER_MASTER;

        let fields=String();

        let result = await dbTemplate.LoginUser(tableName, fields,userMap);
        return result;
    } catch (userLoginError) {
        logger.error(global.messages.GET_TABLE_DATA_FAILURE,userLoginError);
        throw userLoginError;
    }
};

/**
 * Retrieves project names from the 'project_master' table.
 * @returns {Object} - An Object containing bug details.
 * @throws {Error} - If an error occurs during the retrieval process.
 */


exports.GetProjectNames = async (tokenData,category) => {
    try {
        let tableName=global.dbvalues.PROJECT_MASTER_TABLE;
        let fields=String();

        if(category == global.dbvalues.PROJECT_MANAGER){
        let projectManager=tokenData.data;
        let condition = `project_manager='${projectManager}'`;

        let teamData= await dbTemplate.GetTableData(global.dbvalues.TEAM_MASTER,fields,condition)
        let teamName=teamData.data[0].team;


        condition = `team='${teamName}'`;
        let result = await dbTemplate.GetTableData(tableName, fields,condition);

        return result;
        }
        else if(category == "Tester"){
            let tableName="tester_master"
            let tester=tokenData.data;
            let condition = `tester='${tester}'`;
            let result = await dbTemplate.GetTableData(tableName, fields,condition);
            return result;
        }
        else{
            let teamLead=tokenData.data;
            let condition = `team_lead='${teamLead}'`;
            let result = await dbTemplate.GetTableData(tableName, fields,condition);
            return result;
        }
       
        
    } catch (getProjectBugsError) {
        logger.error(global.messages.GET_TABLE_DATA_FAILURE,getProjectBugsError);
        throw getProjectBugsError;
    }
};





/**
 * Retrieves project names from the 'bug_source_master' table.
 * @returns {Object} - An Object containing bug details.
 * @throws {Error} - If an error occurs during the retrieval process.
 */
exports.GetDefaultBugData = async () => {
    try {

        let tableName = global.dbvalues.BUG_DEFAULT_INFO_MASTER_TABLE;
        let fields=String();
        let conditions = String();

        let result = await dbTemplate.GetTableData(tableName, fields,conditions);

        return result;
    } catch (getBugSourceError) {
        logger.error(global.messages.GET_TABLE_DATA_FAILURE, getBugSourceError);
        throw getBugSourceError;
    }
};

/**
 * Inserts bug details into the 'bugs_data' table.
 * @param {Map} bugMap - A map containing bug details.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the insertion process.
 */
exports.InsertBugDetails = async (bugMap) => {
    try {
        logger.info(global.messages.ADD_BUG);
        let fields=String();

        let result = await dbTemplate.InsertBugToDb(global.dbvalues.BUGS_TABLE, bugMap,fields);
        return result;
    } catch (addBugError) {
        logger.error(global.messages.ADD_BUG_FAILURE, addBugError);
        throw addBugError;
    }
};

/**
 * Retrieves all bug details from the 'bugs_data' table.
 * @returns {Object} - An Object containing bug details.
 * @throws {Error} - If an error occurs during the retrieval process.
 */
exports.GetAllBugDetails = async (teamName) => {
    try {
        logger.info(global.messages.GET_ALL_BUGS);
        let result = await dbTemplate.GetBugDetails(global.dbvalues.BUGS_TABLE,teamName);
        return result;
    } catch (getBugsError) {
            logger.error(global.messages.GET_ALL_BUGS_FAILURE,getBugsError);
            throw getBugsError;
    }
};

/**
 * Retrieves bug details for a specific project from the 'bugs_data' table.
 * @param {string} projectName - The name of the project.
 * @returns {Object} - An Object containing bug details for the specified project.
 * @throws {Error} - If an error occurs during the retrieval process.
 */
exports.GetProjectBugsDetails = async (projectName) => {
    try {
        logger.info(global.messages.GET_PROJECT_BUGS);

        let fields=String();
        let tableName=global.dbvalues.BUGS_TABLE;
        let condition=`bug_data->>'project_name' = '${projectName}'`;

        let result = await dbTemplate.GetTableData(tableName, fields, condition);

        return result;
    } catch (getProjectBugsError) {
        logger.error(global.messages.GET_PROJECT_BUG_FAILURE,getProjectBugsError);
        throw getProjectBugsError;
    }
};

/**
 * Retrieves bug count for a specific project from.
 * @param {string} projectName - The name of the project.
 * @returns {Object} - An Object containing bug count for the specified project.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.GetProjectBugCount = async (projectName) => {
    try {
        logger.info(global.messages.GET_PROJECT_BUGS);

        let fields=String();
        let result = await dbTemplate.GetProjectBugCount(global.dbvalues.BUGS_TABLE, fields, projectName);

        return result;
    } catch (getProjectBugsError) {
        logger.error(global.messages.GET_PROJECT_BUG_FAILURE,getProjectBugsError);
        throw getProjectBugsError;
    }
};

/**
 * Get data of a speficic bug of a specific project.
 * @param {string} bugId - The id of bug.
 * @returns {Object} - An Object containing bug count for the specified project.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.GetSpecificBugsData = async (bugId) => {
    try {
        logger.info(global.messages.GET_BUG);

        let fields=String();
        let condition= `id = '${bugId}'`;
        let tableName=global.dbvalues.BUGS_TABLE;

        let result = await dbTemplate.GetTableData(tableName, fields, condition);

        return result;
    } catch (getProjectBugsError) {
        logger.error(global.messages.GET_BUG_FAILURE,getProjectBugsError);
        throw getProjectBugsError;
    }
};

/**
 * Get developer data for a specific project.
 * @param {string} project - The name of the project.
 * @returns {Object} - An Object containing developer data for the specified project.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.GetDeveloperData = async (project) => {
    try {
        let tableName = global.dbvalues.DEVELOPER_MASTER;
        let fields=global.dbvalues.DEVELOPER_VALUE;
        let condition = `project= '${project}'`;

        let result = await dbTemplate.GetTableData(tableName, fields,condition);

        return result;
    } catch (getBugSourceError) {
        logger.error(global.messages.GET_TABLE_DATA_FAILURE, getBugSourceError);
        throw getBugSourceError;
    }
};

/**
 * Edit bug of a specific project.
 * @param {string} bugData - The data of bug.
 * @returns {Object} - An Object containing bug count for the specified project.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.EditBug = async (bugMap) => {
    try {
        logger.info(global.messages.UPDATE_PROJECT_BUG);

        let fields=String();
        let tableName=global.dbvalues.BUGS_TABLE;
        let result = await dbTemplate.updateTableData(tableName, fields, bugMap);

        return result;
    } catch (editBugsError) {
        logger.error(global.messages.UPDATE_TABLE_DATA_FAILURE,editBugsError);
        throw editBugsError;
    }
};


/**
 * Fetch assigned bugs for a specific developer.
 * @param {string} userData - The user data for the developer.
 * @returns {Object} - An Object containing assigned bugs for the specified developer.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.FetchAssignedBugs = async (userData) => {
    try {
        logger.info(global.messages.GET_ALL_BUGS);
        let tableName=global.dbvalues.BUGS_TABLE;
        let condition=`assigned_to='${userData}'`;
        let fields=String();

        let result = await dbTemplate.GetTableData(tableName,fields,condition);
        return result;
    } catch (getBugsError) {
            logger.error(global.messages.GET_ALL_BUGS_FAILURE,getBugsError);
            throw getBugsError;
    }
};


/**
 * Check weather new project is unique or not.
 * @param {string} project - The project data.
 * @returns {Object} - An Object containing assigned bugs for the specified developer.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.CheckUniqueProject = async (project) => {
    try {
        let tableName=global.dbvalues.PROJECT_MASTER;
        let condition=`project='${project}'`;
        let fields=String();

        let result = await dbTemplate.GetTableData(tableName,fields,condition);
        return result;
    } catch (uniqueProjectError) {
            logger.error(global.messages.GET_ALL_BUGS_FAILURE,uniqueProjectError);
            throw uniqueProjectError;
    }
};




/**
 * Function to get count of team leads for a project.
 * @param {string} project - The project data.
 * @returns {Object} - An Object containing assigned bugs for the specified developer.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.GetTeamLeadsCount = async (project) => {
    try {
        let tableName=global.dbvalues.PROJECT_MASTER;
        let condition=`project='${project}'`;
        let fields=String();

        let result = await dbTemplate.GetTableData(tableName,fields,condition);
        return result;
    } catch (getTeamLeadsError) {
            logger.error(global.messages.TEAM_LEADS_FAILURE,getTeamLeadsError);
            throw getTeamLeadsError;
    }
};



/**
 * Function to Check weather a bug is unique or not.
 * @param {string} bugData - The data of bug.
 * @returns {Object} - An Object containing bug count for the specified project.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.CheckUniqueBug = async (bugMap) => {
    try {

        let fields=String();
        let condition=String()
        let tableName=global.dbvalues.BUGS_TABLE;
        
        for (let [key, value] of bugMap.entries()) {
            if(key !== 'uniqueProjects'){
            condition += `bug_data->>'${key}'='${value}' AND `;
            }
        }
        
        condition = condition.slice(0, -5);

        let result = await dbTemplate.GetTableData(tableName,fields,condition);

        return result;
    } catch (uniqueBugsError) {
        logger.error(global.messages.UNIQUE_BUG_FAILURE,uniqueBugsError);
        throw uniqueBugsError;
    }
};
