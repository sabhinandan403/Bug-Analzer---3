/**
 * Project Name: Bug Analyzer
 * @Project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
 * 
 * Module: Database
 * Description
 * ----------------------------------------------------------------------------------- 
 * Contains the functions to generate Database Query
 * 
 * -----------------------------------------------------------------------------------
 * 
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Yash Pathak          Jan 19, 2024        Initially Created
 * Yash Pathak          Jan 19, 2024        Added function to add bug data into database.
 * Yash Pathak          Jan 20, 2024        Added function to get bug data of all bugs from database.
 * Yash Pathak          Jan 21, 2024        Added function to get bug data of specific project from database.
 * Yash Pathak          Jan 23, 2024        Added function to get fields data for registered bugs form.
 * Yash Pathak          Jan 29, 2024        Added function to check if user exits and user is unique.
 * Yash Pathak          Feb 01, 2024        Added function to get bug details grouped by project from the database for a specific project.
 * Yash Pathak          Feb 02, 2024        Added function to update table data.
 * Yash Pathak          Feb 06, 2024        Updated function to get bug details grouped by project from the database for all projects of a team. 
 * -----------------------------------------------------------------------------------
 */

let pool = require("./dbConnector");
let bcrypt=require("bcrypt");

/**
 * Checks if a user exists in the specified table based on the provided user map.
 * @param {string} tableName - Name of the table to check for user existence.
 * @param {Map} userMap - User information to check for existence.
 * @returns {boolean} - True if the user exists, false otherwise.
 */

async function UserExists(tableName,userMap) {
    try{
    let condition = '';

    for (let [key, value] of userMap) {
        condition += `${key}='${value}'`;
        break; // Stop the loop after the first iteration
    }

    let query =`SELECT * FROM ${tableName} WHERE ${condition}`;
    let userResult= await pool.query(query);
    return userResult.rowCount > 0;

    } catch (error) {
        logger.error(global.dbvalues.USER_NOT_EXITS, error);
        return false;
    }
}



/**
 * Checks if a user with a unique email and userid exists in different tables.
 * @param {Map} userMap - User information to check for uniqueness.
 * @param {string} fields - Columns of the table to be returned.
 * @returns {boolean} - True if the user is unique, false if the user already exists.
 */

exports.CheckUniqueUser= async function(userMap,category,fields){

    if (fields == "" || fields == null)
            fields = '*';

    let userid="";
    if(category===global.dbvalues.TEAM_LEAD) userid=global.dbvalues.TEAM_LEAD_VALUE;
    else if(category===global.dbvalues.PROJECT_MANAGER) userid=global.dbvalues.PROJECT_MANAGER_VALUE;
    else userid=global.dbvalues.DEVELOPER_VALUE;
    
    let userId=userMap.get(userid);
    let userEmail=userMap.get('email');

    let query1 = `SELECT ${fields} FROM ${global.dbvalues.TEAM_MASTER} WHERE project_manager = '${userId}'`;
    let result1 = await pool.query(query1);

    let query2 = `SELECT ${fields} FROM ${global.dbvalues.PROJECT_MASTER} WHERE team_lead = '${userId}'`;
    let result2 = await pool.query(query2);

    let query3 = `SELECT ${fields} FROM ${global.dbvalues.DEVELOPER_MASTER} WHERE developer = '${userId}'`;
    let result3 = await pool.query(query3);

    let query4 = `SELECT ${fields} FROM ${global.dbvalues.TEAM_MASTER} WHERE email = '${userEmail}'`;
    let result4 = await pool.query(query4);

    let query5 = `SELECT ${fields} FROM ${global.dbvalues.PROJECT_MASTER} WHERE email = '${userEmail}'`;
    let result5 = await pool.query(query5);

    let query6 = `SELECT ${fields} FROM ${global.dbvalues.DEVELOPER_MASTER} WHERE email = '${userEmail}'`;
    let result6 = await pool.query(query6);

    let query7=  `SELECT ${fields} FROM ${global.dbvalues.TESTER_MASTER_TABLE} WHERE tester = '${userId}'`;
    let result7 = await pool.query(query7);

    let query8 = `SELECT ${fields} FROM ${global.dbvalues.TESTER_MASTER_TABLE} WHERE email = '${userEmail}'`;
    let result8 = await pool.query(query8);


    if(result1.rowCount > 0 || result2.rowCount > 0 || result3.rowCount > 0 ||
       result4.rowCount > 0 || result5.rowCount > 0 || result6.rowCount > 0 
       || result7.rowCount > 0 || result8.rowCount > 0 ) return false;
 
    return true;
}

/**
 * @desc Logins a user based on the provided user map.
 * @param {string} tableName - Name of the table to fetch data from
 * @param {string} fields - Columns of the table to be returned 
 * @param {Object} userMap - User information for authentication.
 * @returns {Object} - Authentication result.
 */

exports.LoginUser = async function(tableName, fields, userMap) {
    try {
        if(await UserExists(tableName,userMap)){
        if (fields === "" || fields === null)
            fields = '*';

        let password=userMap.get("password");
        fields = 'password';
        let condition = '';

        for (let [key, value] of userMap) {
            condition += `${key}='${value}'`;
            break; 
        }
            
        let passwordResult = await pool.query(`SELECT ${fields} FROM ${tableName} WHERE ${condition}`);
        let hashedPassword = passwordResult.rows[0].password;

        //Comparing password using bcrypt
        let passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {
            logger.info(global.messages.LOGIN_SUCCESS);
            return { success: true, message: global.messages.LOGIN_SUCCESS};
        } else {
            logger.error(global.messages.PASSWORD_INCORRECT);
            return { success: false, message: global.messages.PASSWORD_INCORRECT};
        }
    }
    else{
        logger.error(global.messages.USER_NOT_EXIT);
        return { success: false, message: global.messages.USER_NOT_EXIT};
    }
    } catch (userLoginError) {
        logger.error(`${tableName} ${global.messages.GET_TABLE_DATA_FAILURE}`, userLoginError);
        return { success: false, message: global.messages.GET_TABLE_DATA_FAILURE};
    }
}


/**
 * @desc Get  details for a specific table from the database
 * @param {string} tableName - Name of the table to fetch data from
 * @param {string} fields - Columns of the table to be returned 
 * @returns {Object} Object indicating success or failure with a message and data
 */
exports.GetTableData= async function(tableName,fields,condition) {
    try {
        if (fields == "" || fields == null)
            fields = '*';

        let query = `SELECT ${fields} FROM ${tableName}`;

        if(condition != ""){
            query=query + ' ' + `WHERE ${condition}`;
        }

        let result = await pool.query(query);

        if (result.rowCount > 0) {
            logger.info(`${tableName} ${global.messages.GET_TABLE_DATA_DB_SUCCESS}`);
            return { success: true, message: global.messages.GET_TABLE_DATA_SUCCESS, data: result.rows };
        }
        else{
            logger.info(`${tableName} ${global.messages.GET_TABLE_DATA_DB_FAILURE}`);
            return { success: false, message: global.messages.GET_TABLE_DATA_FAILURE};
        }
    } catch (getProjectBugError) {
        logger.error(`${tableName} ${global.messages.GET_TABLE_DATA_DB_FAILURE}`, getProjectBugError);
        return { success: false, message: global.messages.GET_TABLE_DATA_FAILURE};
    }
}

/**
 * @desc Insert data into the database table
 * @param {string} tableName - Name of the table to insert data into
 * @param {Map} mapData - Key-value pairs of columns and corresponding values to be inserted
 * @returns {Object} Object indicating success or failure with a message
 */
exports.InsertToDb = async (tableName, mapData,fields) => {
    try {
        let placeholders = '';
        let values = [];

        let index = 1; // Start with $1 for parameter placeholders.

        mapData.forEach((key, value) => {
            fields += value + ', ';
            placeholders += '$' + index++ + ', ';
            values.push(key);
        });

        // Remove the trailing commas from fields and placeholders.
        fields = fields.slice(0, -2);
        placeholders = placeholders.slice(0, -2);

        let query = `INSERT INTO ${tableName} (${fields}) VALUES (${placeholders})`;

        let result = await pool.query(query, values);

        if (result.rowCount > 0) {
            logger.info(global.messages.DATABASE_SUCCESS);
            return { success: true, message: global.messages.DATABASE_SUCCESS };
        } 

    } catch (addBugError) {
        logger.error(global.messages.DATABASE_FAILURE, addBugError);
        return { success: false, message: global.messages.DATABASE_FAILURE };
    }
}

/**
 * @desc Get bug details grouped by project from the database for all projects of a team. 
 * @param {string} tableName - Name of the table to fetch data from
 * @returns {Object} Object indicating success or failure with a message and data
 */

exports.GetBugDetails = async (tableName, teamName) => {
    try {
        let result = await pool.query(`
        SELECT DISTINCT
        pm.team,
        bd.project_name,
        COALESCE(criticalCount, 0) AS criticalCount,
        COALESCE(majorCount, 0) AS majorCount,
        COALESCE(minorCount, 0) AS minorCount,
        COALESCE(lowCount, 0) AS lowCount
    FROM 
        project_master pm
    LEFT JOIN (
        SELECT 
            bug_data->>'project_name' AS project_name,
            COUNT(*) FILTER(WHERE bug_data->>'bug_category' = 'Critical') AS criticalCount,
            COUNT(*) FILTER(WHERE bug_data->>'bug_category' = 'Major') AS majorCount,
            COUNT(*) FILTER(WHERE bug_data->>'bug_category' = 'Minor/Moderate') AS minorCount,
            COUNT(*) FILTER(WHERE bug_data->>'bug_category' = 'Low') AS lowCount
        FROM 
            ${tableName}
        GROUP BY 
            project_name
    ) bd ON pm.project = bd.project_name
    WHERE 
        pm.team = '${teamName}';
        `);

        if (result.rowCount > 0) {
            logger.info(global.messages.GET_ALL_BUGS_DB_SUCCESS);
            return { success: true, message: global.messages.GET_ALL_BUGS_SUCCESS, data: result.rows };
        }
    } catch (getBugError) {
        logger.error(global.messages.GET_ALL_BUGS_DB_FAILURE, getBugError);
        return { success: false, message: global.messages.GET_ALL_BUGS_FAILURE};
    }
};



/**
 * @desc Get bug details grouped by project from the database for a specific project.
 * @param {string} tableName - Name of the table to fetch data from
 * @returns {Object} Object indicating success or failure with a message and data
 */

exports.GetProjectBugCount = async (tableName, fields, projectName) => {
    try {
        let result = await pool.query(`
        SELECT
        bug_data->>'project_name',
        COUNT(*) FILTER(WHERE bug_data->>'bug_category' = 'Critical') AS criticalCount,
        COUNT(*) FILTER(WHERE bug_data->>'bug_category' = 'Major') AS majorCount,
        COUNT(*) FILTER(WHERE bug_data->>'bug_category' = 'Minor/Moderate') AS MinorCount,
        COUNT(*) FILTER(WHERE bug_data->>'bug_category' = 'Low') AS lowCount
        FROM ${tableName} WHERE bug_data->>'project_name'='${projectName}'
        GROUP BY bug_data->>'project_name'`);

        if (result.rowCount > 0) {
            logger.info(global.messages.GET_ALL_BUGS_DB_SUCCESS);
            return { success: true, message: global.messages.GET_ALL_BUGS_SUCCESS, data: result.rows };
        }
    } catch (getBugError) {
        logger.error(global.messages.GET_ALL_BUGS_DB_FAILURE, getBugError);
        return { success: false, message: global.messages.GET_ALL_BUGS_FAILURE};
    }
};

/**
 * @desc Updates data of table.
 * @param {string} tableName - Name of the table to update data.
 * @param {string} data - Data to update.
 * @param {string} fields - Columns of the table to be returned 
 * @returns {Object} - Result containing success status, message, and data.
 */

exports.updateTableData = async function updateTableData(tableName, fields, bugMap) {
    try {
        bugMap.forEach((key, value) => {
            if(value!=="id"){
            fields =fields+ `${value}='${key}'` + `,`;
            }
        });

        // Remove the trailing commas from fields and placeholders.
        fields = fields.slice(0, -1);

        // Build the update query
        let query = `UPDATE ${tableName} SET ${fields} WHERE id=${bugMap.get('id')}`;

        // Execute the update query using dbTemplate
        let result = await pool.query(query);

        if (result.rowCount > 0) {
            logger.info(`${tableName} ${global.messages.UPDATE_TABLE_DATA_DB_SUCCESS}`);
            return { success: true, message: global.messages.UPDATE_TABLE_DATA_SUCCESS, data: result.rows };
        }
    } catch (getProjectBugError) {
        logger.error(`${tableName} ${global.messages.UPDATE_TABLE_DATA_DB_FAILURE}`, getProjectBugError);
        return { success: false, message: global.messages.UPDATE_TABLE_DATA_FAILURE};
    }
};



exports.InsertBugToDb = async (tableName, bugData, fields) => {

    try{
    
    fields='{'
    bugData.forEach((key, value) => {
        if(value!=="id"){
            fields += `"${value}": "${key}",`;
        }
    });

    fields = fields.slice(0, -1);
    fields+='}';


    let query = `INSERT INTO ${tableName} (bug_data) VALUES ($1) ON CONFLICT (bug_data) DO NOTHING` ;

    let result = await pool.query(query, [fields]);

    if (result.rowCount > 0) {
        logger.info(global.messages.DATABASE_SUCCESS);
        return { success: true, message: global.messages.DATABASE_SUCCESS };
    } 

} catch (addBugError) {
    logger.error(global.messages.DATABASE_FAILURE, addBugError);
    return { success: false, message: global.messages.DATABASE_FAILURE };
}
};

