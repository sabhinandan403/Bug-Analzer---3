/**
 * Project Name : Bug Analyzer
 * @Project Bug Analyzer
 * @author  Yash Pathak
 * @date    Jan 20, 2024 
 * 
 * Module: Mapper
 * Description
 * ----------------------------------------------------------------------------------- 
 * Contains mapper function to map incoming bug data into a map.
 * 
 * -----------------------------------------------------------------------------------
 * 
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Yash Pathak          Jan 20, 2024        Initially Created
 * Yash Pathak          Jan 20, 2024        Added mapper function to map bug data into a hashmap
 * -----------------------------------------------------------------------------------
 */

const middleware=require("../middleware/GenerateToken");

/**
 * Maps incoming bug data into a hashmap.
 * @param {Object} bugData - An object containing bug data.
 * @returns {Map} - A hashmap containing bug data.
 * @throws {Error} Throws an error if there is an issue while mapping the bug data.
 */

exports.MakeHashMap = (bugData) => {
    try {
        let bugMap = new Map();

        for (let key in bugData) {

            if (bugData.hasOwnProperty(key) && key !== 'created_by') {
                bugMap.set(key, bugData[key]);
            }
            else {
                let tokenData=middleware.DecodeToken(bugData[key]);
                bugMap.set(key, tokenData.data);
            }
        }

        logger.info(global.messages.MAPPER_SUCCESS);
        return bugMap;
    } catch (mapperError) {
        logger.error(global.messages.MAPPER_ERROR, mapperError);
        throw new Error(global.messages.MAPPER_ERROR);
    }
};

/**
 * Maps incoming bug data into a hashmap.
 * @param {Object} bugData - An object containing bug data.
 * @returns {Map} - A hashmap containing bug data.
 * @throws {Error} Throws an error if there is an issue while mapping the bug data.
 */

exports.EditMap = (bugData) => {
    try {
        let bugMap = new Map();
        bugMap.set('id', bugData.bugId);
        if(bugData.bugSource !== undefined) bugMap.set('bug_source', bugData.bugSource);
        if(bugData.bugDescription !== undefined) bugMap.set('bug_description', bugData.bugDescription);
        if(bugData.bugType !== undefined) bugMap.set('bug_type', bugData.bugType);
        if(bugData.bugCategory !== undefined) bugMap.set('bug_category', bugData.bugCategory);
        if(bugData.rootCause !== undefined) bugMap.set('root_cause', bugData.rootCause);
        if(bugData.actionToPrevent !== undefined) bugMap.set('action_to_prevent', bugData.actionToPrevent);
        if(bugData.remarks !== undefined) bugMap.set('remarks', bugData.remarks);

        if(bugData.bugStatus !== '' && bugData.bugStatus !== undefined) bugMap.set('bug_status', bugData.bugStatus);
        if(bugData.assignedTo !== '' && bugData.assignedTo !== undefined) bugMap.set('assigned_to', bugData.assignedTo);

        logger.info(global.messages.MAPPER_SUCCESS);
        return bugMap;
    } catch (mapperError) {
        logger.error(global.messages.MAPPER_ERROR, mapperError);
        throw new Error(global.messages.MAPPER_ERROR);
    }
};
