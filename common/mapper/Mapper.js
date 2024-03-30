/**
 * Project Name : Bug Analyzer
 * @Project Bug Analyzer
 * @author  Yash Pathak
 * @date    Jan 30, 2024 
 * 
 * Module: Mapper
 * Description
 * ----------------------------------------------------------------------------------- 
 * Contains mapper function to map incoming user data into a map.
 * 
 * -----------------------------------------------------------------------------------
 * 
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Yash Pathak          Jan 29, 2024        Initially Created
 * -----------------------------------------------------------------------------------
 */

let bcrypt=require('bcrypt');

/**
 * Maps incoming user data into a hashmap.
 * @param {Object} userData - An object containing user data.
 * @returns {Map} - A hashmap containing user data.
 * @throws {Error} Throws an error if there is an issue while mapping the user data.
 */


exports.LoginHashmap = async (userData,req)=>{
    try {
        let category=req.body.category;
        let userMap = new Map();
        for (let key in userData) {

            if (userData.hasOwnProperty(key) && key!=='category' && key !=='userid') {
                userMap.set(key, userData[key]);
            }

            if(userData.hasOwnProperty(key) && key=='userid'){
                if(category=='Project Manager') userMap.set('project_manager', userData[key]);
                else if(category=='Team Lead') userMap.set('team_lead', userData[key]);
                else if(category=='Developer') userMap.set('developer', userData[key]);
                else userMap.set('tester', userData[key]);

            }
        }

        logger.info(global.messages.MAPPER_SUCCESS);
        return userMap;
    } catch (mapperError) {
        logger.error(global.messages.MAPPER_ERROR, mapperError);
        throw new Error(global.messages.MAPPER_ERROR);
    }
}

/**
 * Maps incoming user data into a hashmap to add a user.
 * @param {Object} userData - An object containing user data.
 * @returns {Map} - A hashmap containing user data.
 * @throws {Error} Throws an error if there is an issue while mapping the user data.
 */

exports.MakeUserMap = async (userData) => {
    try {
        let userMap = new Map();
        for (let key in userData) {

            if (userData.hasOwnProperty(key)) {

                //store hashed password in the map.
                if(key==='password'){
                    let hashedPassword=await bcrypt.hash(userData[key],10);
                    userMap.set(key, hashedPassword);
                }
                else if(key!=='category'){
                userMap.set(key, userData[key]);
                }
                
            }
        }

        logger.info(global.messages.MAPPER_SUCCESS);
        return userMap;
    } catch (mapperError) {
        logger.error(global.messages.MAPPER_ERROR, mapperError);
        throw new Error(global.messages.MAPPER_ERROR);
    }
};

/**
 * Maps incoming user data into a hashmap to get project.
 * @param {Object} userData - An object containing user data.
 * @returns {Map} - A hashmap containing user data.
 * @throws {Error} Throws an error if there is an issue while mapping the user data.
 */


exports.GetProjectMap = async (userMap) => {
    try {
    let updatedUserMap = new Map([...userMap.entries()].map(([key, value]) => {
    if (key === "project_manager") {
      key = "team_lead";
    }
    return [key, value];
    }));

    logger.info(global.messages.MAPPER_SUCCESS);
    return updatedUserMap;
    } catch (mapperError) {
        logger.error(global.messages.MAPPER_ERROR, mapperError);
        throw new Error(global.messages.MAPPER_ERROR);
    }
}

/**
 * Maps incoming user data into a hashmap to get team.
 * @param {Object} userData - An object containing user data.
 * @returns {Map} - A hashmap containing user data.
 * @throws {Error} Throws an error if there is an issue while mapping the user data.
 */

exports.GetTeamMap = async (userMap) => {
    try {
      let updatedUserMap = new Map([...userMap.entries()].map(([key, value]) => {
        // If the key is "project", skip it
        if (key === "project") {
          return null;
        }
        // For other keys, return the entry as it is
        return [key, value];
      }).filter(entry => entry !== null)); // Filter out null entries
  
      logger.info(global.messages.MAPPER_SUCCESS);
      return updatedUserMap;
    } catch (mapperError) {
      logger.error(global.messages.MAPPER_ERROR, mapperError);
      throw new Error(global.messages.MAPPER_ERROR);
    }
  }
  