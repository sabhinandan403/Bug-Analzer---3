/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
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
 * Yash Pathak       Jan 19, 2024        Initially Created
 * Yash Pathak       Jan 19, 2024        Added function to add new bug.
 * Yash Pathak       Jan 20, 2024        Added function to get data of all bugs.
 * Yash Pathak       Jan 21, 2024        Added function to get data of project specific bugs.
 * Yash Pathak       Jan 23, 2024        Added function to get fields data for registered bugs form.
 * Yash Pathak       Jan 30, 2024        Updated function to get project names.
 * Yash Pathak       Jan 31, 2024        Added function to Edit spefific bug data.
 * Yash Pathak       Feb 02, 2024        Added function to retrieve  spefific bug data and to retrieve all bug details of a team.
 * Yash Pathak       Feb 18, 2024        Updated function to edit bug data. 
* -----------------------------------------------------------------------------------
 */

let dbService = require("../common/db/DbService");
let bugMapper = require('../common/mapper/BugsMapper');
let FormValidator=require("../common/validator/FormValidator");


/**
 * Service layer function to get project names.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the insertion process.
 */
exports.GetProjectNameData=async (tokenData,category) => {
    try {
        let projectName = await dbService.GetProjectNames(tokenData,category);
        return projectName;
    } catch (getProjectError) {
        throw getProjectError;
    }
}


/**
 * Service layer function to get project source.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the insertion process.
 */
exports.GetDefaultBugData = async () => {
    try {
        let bugData = await dbService.GetDefaultBugData();
        return bugData;
    } catch (bugDataError) {
        throw bugDataError;
    }
}

/**
 * Service layer function to add bug details.
 * @param {Object} bugData - An object containing bug details.
 * @returns {Object} - An object containing success status and a message.
 * @throws {Error} - If an error occurs during the insertion process.
 */
exports.AddBug = async (bugData) => {
    try {
        let bugMap = bugMapper.MakeHashMap(bugData);
        let addBugResult = await dbService.InsertBugDetails(bugMap);
        return addBugResult;
    } catch (addBugError) {
        throw addBugError;
    }
};

/**
 * Service layer function to retrieve all bug details of a team.
 * @returns {Array} - An array containing bug details.
 * @throws {Error} - If an error occurs during the retrieval process.
 */
exports.GetBugData = async (teamName) => {
    try {
        let bugData = await dbService.GetAllBugDetails(teamName);
        return bugData;
    } catch (getBugError) {
        throw getBugError;
    }
};

/**
 * Service layer function to retrieve project spefific bug details.
 * @param {string} projectName - The name of the project.
 * @returns {Object} - An Object containing bug details for the specified project.
 * @throws {Error} - If an error occurs during the retrieval process.
 */
exports.GetProjectBugsData = async (projectName) => {
    try {
        let bugData = await dbService.GetProjectBugsDetails(projectName);
        return bugData;
    } catch (getProjectBugsError) {
        throw getProjectBugsError;
    }
};


/**
 * Service layer function to retrieve project spefific bug count.
 * @param {string} projectName - The name of the project.
 * @returns {Object} - An Object containing bug count for the specified project.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.GetProjectBugCount = async (projectName) => {
    try {
        let bugData = await dbService.GetProjectBugCount(projectName);
        return bugData;
    } catch (getProjectBugsError) {
        throw getProjectBugsError;
    }
};

/**
 * Service layer function to retrieve  spefific bug data.
 * @param {string} bugId - The id of the bug.
 * @returns {Object} - An Object containing bug data.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.GetSpecificBugsData = async (bugId) => {
    try {
        let bugData = await dbService.GetSpecificBugsData(bugId);
        return bugData;
    } catch (projectBugError) {
        throw projectBugError;
    }
};

/**
 * Service layer function to Edit spefific bug data.
 * @param {string} bugData - The data of the bug.
 * @returns {Object} - An Object containing bug data.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.EditBug= async (bugData) => {
    try {
        let oldBugData = await dbService.GetSpecificBugsData(bugData.bugId);
        let status=FormValidator.CheckEditedData(bugData,oldBugData.data[0]);

        if(status){
        let bugMap = bugMapper.EditMap(bugData);
        let bugResult = await dbService.EditBug(bugMap);
        return bugResult;
        }
        else{
        return { success: false, message: global.messages.EDIT_BUG_DATA_FAILURE};
        }
    } catch (editBugError) {
        throw editBugError;
    }
};


/**
 * Service layer function to Check Unique bug data.
 * @param {string} bugData - The data of the bug.
 * @returns {Object} - An Object containing bug data.
 * @throws {Error} - If an error occurs during the retrieval process.
 */

exports.CheckUniqueBug= async (bugData) => {
    try {
        
        //To check weathe the bug data is valid
        let status=FormValidator.CheckValidBug(bugData);
        
        if(status){
        //If bug data is valid then only check weather it is unique or not.
        let bugMap = bugMapper.MakeHashMap(bugData);
        let bugResult = await dbService.CheckUniqueBug(bugMap);

        if(!bugResult.success){
            return { success: true, message: global.messages.UNIQUE_BUG_SUCCESS};
        }
        else{
            return { success: false, message: global.messages.UNIQUE_BUG_FAILURE};
        }
        }
        else{
        return { success: false, message: global.messages.INVALID_BUG_DATA};
        }
    } catch (editBugError) {
        throw editBugError;
    }
};