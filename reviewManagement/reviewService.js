/* eslint-disable no-undef */
/**
 * Project Name: Bug Analyzer
 * @project Review Management
 * @author Abhinandan Kumar
 * @date Mar 26, 2024
 *
 * Description
 * -----------------------------------------------------------------------------------
 * Service file to get the data from the database.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By            Modified On            Description
 * Abhinandan Kumar       April 01, 2024         Initially Created
 * 
 * -----------------------------------------------------------------------------------
 */


const pool = require('../common/db/DbConnector')
const messages = require('../common/messages/Messages')
const constants = require('../common/config/Constants')


/**
 * @description To get review category from the database
 * @param  {} 
 * @param  {} 
 */

exports.GetReviewType = async function () {

    try {
        var query = `SELECT review_type FROM review_type`
        var result = await pool.query(query)
        if (result.rowCount > 0) {
            return { success: true, data: result.rows }
        }
        else {
            return { success: false, message: messages.DATABASE_FAILURE }
        }
    } catch (error) {
        logger.error(messages.GET_REVIEW_TYPE_FAILURE)
        console.log('Error fetching review type in review service :', error)
        return { success: false, message: messages.DATABASE_FAILURE }
    }

}

/**
 * @description To get developer name from the database
 * @param  {} username
 * @param  {} usertype
 */

exports.GetDeveloperName = async function (usertype, username) {
    var query
    if (usertype === constants.PROJECT_MANAGER) {
        query = `
        WITH team_lead_query AS (
            SELECT pm.team_lead AS developer
            FROM project_master pm
            JOIN team_master tm ON  pm.team = tm.team
            WHERE tm.project_manager = '${username}'
            EXCEPT 
            SELECT '${username}' FROM project_master
        ),
        developer_query AS (
            SELECT dm.developer
            FROM developer_master dm
            JOIN project_master pm ON dm.project = pm.project AND dm.team = pm.team
            WHERE pm.team_lead = '${username}'
        )
        SELECT developer FROM team_lead_query
        UNION
        SELECT developer FROM developer_query
        UNION
        SELECT 'No Data' AS developer
        WHERE NOT EXISTS (SELECT 1 FROM team_lead_query) AND NOT EXISTS (SELECT 1 FROM developer_query);
        
         `
    } else if (usertype === constants.TEAM_LEAD) {
        query = `
        WITH developer_query AS (
            SELECT dm.developer 
            FROM developer_master dm
            JOIN project_master pm ON dm.project = pm.project AND dm.team = pm.team
            WHERE pm.team_lead = '${username}'
        )
        SELECT developer FROM developer_query
        UNION
        SELECT 'No Data' AS developer
        WHERE NOT EXISTS (SELECT 1 FROM developer_query);
        

        `
    } else if (usertype === constants.DEVELOPER) {
        query = `WITH developer_query AS (
            SELECT dm1.developer 
            FROM developer_master dm1 
            JOIN developer_master dm2 ON dm1.project = dm2.project AND dm1.team = dm2.team
            WHERE dm2.developer = '${username}'
            EXCEPT
            (SELECT developer FROM developer_master WHERE developer='${username}')
        )
        SELECT developer FROM developer_query
        UNION
        SELECT 'No Data' AS developer
        WHERE NOT EXISTS (SELECT 1 FROM developer_query);
        `
    }

    try {
        var result = await pool.query(query)
        if (result.rowCount > 0) {
            return { success: true, data: result.rows }

        } else {
            return { success: false, message: messages.DATA_NOT_FOUND }
        }
    } catch (error) {
        logger.error(messages.DATABASE_FAILURE)
        console.log('Error fetching developer name in service layer :', error)
        return { success: false, message: messages.DATABASE_FAILURE }
    }
}

/**
 * @description To get project name from the database
 * @param  {} username
 * @param  {} usertype
 */

exports.GetProjectName = async function (username, usertype) {
    var query;
    if (usertype === constants.PROJECT_MANAGER) {
        query = `		
        select distinct project from project_master where team= (select team from team_master where project_manager='${username}');`
    } else if(usertype === constants.TEAM_LEAD) {
        query = `SELECT project FROM project_master WHERE team_lead='${username}'`
    }else{
        query = `SELECT project FROM developer_master WHERE developer = '${username}';`
    }

    try {
        var result = await pool.query(query)
        if (result.rowCount > 0) {
            return { success: true, data: result.rows }
        } else {
            return { success: false, message: messages.GET_PROJECT_FAILURE }
        }
    } catch (error) {
        logger.error(messages.GET_PROJECT_FAILURE)
        console.log('Error fetching project name in service layer: ', error)
        return {
            success: false, message: messages.DATABASE_FAILURE
        }
    }
}

/**
 * @description To get project name from the database
 * @param  {} 
 * @param  {} 
 */

exports.GetReviewCategory = async function () {
    try {
        var query = 'SELECT review_category FROM review_category_master'
        var result = await pool.query(query)
        if (result.rowCount > 0) {
            return { success: true, data: result.rows }
        } else {
            return { success: false, message: messages.GET_REVIEW_CATEGORY_FAILURE }
        }
    } catch (error) {
        logger.error(messages.GET_REVIEW_CATEGORY_FAILURE)
        console.log('Error fetching review category in service :', error)
        return { success: false, messages: messages.DATABASE_FAILURE }
    }
}


/**
 * @description To insert review points in the review_master tables
 * @param  {} req.body
 * @param  {} 
 */

exports.AddReviewPoints = async function (body) {

    if (!body) {
        return { success: false, message: messages.BAD_REQUEST }
    }
    var { reviewerName, team, projectName, taskName, reviewType, reviewCategories, wrikeId, developerName, reviewPoints } = body;
    // Check if any of the variables are undefined
    if (!reviewerName || !team || !projectName || !taskName || !reviewType || !reviewCategories || !wrikeId || !developerName || !reviewPoints) {
        return { success: false, message: messages.INVALID_REQUEST };
    }
    

    // Create a new array with the same length as the existing array
    const reviewPointsStatus = Array.from({ length: reviewPoints.length }, () => 'Open');
    const commitIdBefore = Array.from({ length: reviewPoints.length }, () => 'Not Updated');
    const commitIdAfter = Array.from({ length: reviewPoints.length }, () => 'Not Updated');
    const developerComment = Array.from({ length: reviewPoints.length }, () => 'Not Updated');
    
    var query = `  INSERT INTO review_master(reviewer_name,team,project,task_name,wrike_id,review_point,review_type,review_category,developer_name,review_date,review_status,commit_id_before,commit_id_after,developer_comment)
    VALUES (
      '${reviewerName}',
      '${team}',
      '${projectName}',
      '${taskName}',
      '${wrikeId}',
      ARRAY[${reviewPoints.map(point => `'${point}'`).join(', ')}],
      (SELECT review_type_id FROM review_type WHERE review_type='${reviewType}'),
      ARRAY[${reviewCategories.map(category => `'${category}'`).join(', ')}],
      '${developerName}',
      current_timestamp,
      ARRAY[${reviewPointsStatus.map(status => `'${status}'`).join(', ')}],
      ARRAY[${commitIdBefore.map(idBefore => `'${idBefore}'`).join(', ')}],
      ARRAY[${commitIdAfter.map(idAfter => `'${idAfter}'`).join(', ')}],
      ARRAY[${developerComment.map(comment => `'${comment}'`).join(', ')}])
    RETURNING *;
    
    `
    try {
        
        var result = await pool.query(query)
        if (result.rowCount > 0) {
            return { success: true, data: result.rows[0] }

        } else {
            return { success: false, message: messages.ADD_REVIEW_SUCCESS }
        }
    } catch (error) {
        logger.error(messages.ADD_REVIEW_FAILURE)
        console.log('Error inserting review points :', error)
        return { success: false, message: messages.INTERNAL_SERVER_ERROR }
    }

}

/**
 * @description To get review points from the review_master table using the reviewer name
 * @param  {} username
 * @param  {} 
 */

exports.GetReviewPoints = async function (reviewerName) {
    const query = `WITH review_status_counts AS (
        SELECT
            wrike_id,
            COUNT(*) AS total_reviews,
            COUNT(CASE WHEN rs = 'Open' THEN 1 END) AS open_count,
            COUNT(CASE WHEN rs = 'Closed' THEN 1 END) AS closed_count
        FROM
            (
                SELECT
                    wrike_id,
                    UNNEST(review_status) AS rs
                FROM
                    review_master
                WHERE
                    reviewer_name = 'Nilesh Kumar'
            ) AS subquery
        GROUP BY
            wrike_id
    )
    SELECT
        rm.wrike_id,
        rm.task_name,
        rm.reviewer_name,
        rm.review_date,
        rt.review_type,
        CASE
            WHEN open_count = 0 AND closed_count > 0 THEN ARRAY['Closed']
            WHEN closed_count = 0 AND open_count > 0 THEN ARRAY['Open']
            ELSE ARRAY['Open']
        END AS review_status,
        developer_name
    FROM
        review_master rm
    JOIN
        review_status_counts rsc ON rm.wrike_id = rsc.wrike_id
    JOIN
        review_type rt ON rt.review_type_id = rm.review_type
    WHERE
        reviewer_name = '${reviewerName}';`

    try {
        var result = await pool.query(query)
        if (result.rowCount > 0) {
            return { success: true, data: result.rows }
        } else {
            return { success: false, message: messages.GET_REVIEW_POINTS_FAILURE }
        }

    } catch (error) {
        console.log('Error fetching the review points in service :', error)
        logger.error(messages.DATABASE_FAILURE)
        return { success: false, message: messages.GET_REVIEW_POINTS_FAILURE }
    }

}


/**
 * @description To get review points from the review_master table using the wrike id
 * @param  {} username
 * @param  {} 
 */

exports.GetReviewDetails = async function (wrikeId, reviewType) {
    const query = `SELECT 
    rm.review_point,
    rm.review_category,
    rm.review_date,
    rm.review_status AS status,
    rm.developer_name,
    rm.commit_id_after,
    rm.commit_id_before,
    rm.developer_comment,
    CASE 
        WHEN rm.modified_at IS NULL THEN 'Not Updated' 
        ELSE TO_CHAR(rm.modified_at, 'YYYY-MM-DD HH24:MI:SS') 
    END AS modified_at
FROM 
    review_master rm 
WHERE 
    rm.wrike_id = '${wrikeId}' AND rm.review_type=(SELECT review_type_id from review_type WHERE review_type='${reviewType}');
`

    try {
        var result = await pool.query(query)
        if (result.rowCount > 0) {
            return { success: true, data: result.rows }
        } else {
            return { success: false, message: messages.GET_REVIEW_DETAILS_FAILURE }
        }

    } catch (error) {
        console.log('Error fetching the review points in service :', error)
        logger.error(messages.DATABASE_FAILURE)
        return { success: false, message: messages.GET_REVIEW_DETAILS_FAILURE }
    }

}

/**
 * @description To remove review points from the review_master table using the wrike id
 * @param  {} wrikeId
 * @param  {} 
 */

exports.DeleteReview = async function (wrikeId) {
    var query = `DELETE FROM review_master WHERE wrike_id='${wrikeId}' RETURNING *;`
    try {
        var result = await pool.query(query)
        if (result.rowCount > 0) {
            return { success: true, message: messages.REVIEW_REMOVE_SUCCESSFUL }
        } else {
            return { success: false, message: messages.REVIEW_REMOVE_FAILURE }
        }
    } catch (error) {
        console.log('Error while removing review :', error);
        logger.error(messages.DATABASE_FAILURE)
        return { success: false, message: messages.DATABASE_FAILURE }

    }
}

/**
 * @description router to delete review points from the review_master table using the wrike id
 * @param  {} wrikeId
 * @param  {} 
 */

exports.DeleteReviewPoint = async function (wrikeId, body) {
    var { reviewPoints, reviewCategories, reviewDate } = body;

    // Construct the query based on whether reviewPoints and reviewCategories are empty
    var query;
    if (!reviewPoints.length || !reviewCategories.length) {
        // Construct delete query
        query = `DELETE FROM review_master WHERE TO_CHAR(review_date, 'HH24:MI:SS')='${reviewDate}' AND wrike_id=${wrikeId} RETURNING *`;
    } else {
        // Construct update query
        query = `UPDATE review_master SET review_point = ARRAY[${reviewPoints.map(point => `'${point}'`).join(', ')}], review_category=ARRAY[${reviewCategories.map(point => `'${point}'`).join(', ')}]
                WHERE TO_CHAR(review_date, 'HH24:MI:SS')='${reviewDate}' AND wrike_id=${wrikeId} RETURNING *`;
    }

    try {
        var result = await pool.query(query);
        if (result.rowCount > 0) {
            return { success: true, data: result.rows };
        } else {
            return { success: false, message: messages.DELETE_REVIEW_POINT_FAILURE };
        }
    } catch (error) {
        console.log('Error removing review point:', error);
        logger.error(messages.DATABASE_FAILURE);
        return { success: false, message: messages.DATABASE_FAILURE };
    }
}

/**
 * @description router to delete review points from the review_master table using the wrike id
 * @param  {} wrikeId
 * @param  {} 
 */

exports.UpdateReviewPoint = async function (wrikeId, body) {
    var { reviewPoints, reviewCategories, reviewDate } = body;

    // Construct the query based on whether reviewPoints and reviewCategories are empty
    var query;
    if (!reviewPoints.length || !reviewCategories.length) {
        // Construct delete query
        query = `DELETE FROM review_master WHERE TO_CHAR(review_date, 'HH24:MI:SS')='${reviewDate}' AND wrike_id=${wrikeId} RETURNING *`;
    } else {
        // Construct update query
        query = `UPDATE review_master SET review_point = ARRAY[${reviewPoints.map(point => `'${point}'`).join(', ')}], review_category=ARRAY[${reviewCategories.map(point => `'${point}'`).join(', ')}]
                WHERE TO_CHAR(review_date, 'HH24:MI:SS')='${reviewDate}' AND wrike_id=${wrikeId} RETURNING *`;
    }

    try {
        var result = await pool.query(query);
        if (result.rowCount > 0) {
            return { success: true, data: result.rows };
        } else {
            return { success: false, message: messages.UPDATE_REVIEW_POINT_FAILURE };
        }
    } catch (error) {
        console.log('Error removing review point:', error);
        logger.error(messages.DATABASE_FAILURE);
        return { success: false, message: messages.DATABASE_FAILURE };
    }
}

/**
 * @description router to get review points for developer from the review_master table using the wrike id
 * @param  {} wrikeId
 * @param  {} 
 */

exports.GetMyReview = async function (username) {

    // Construct the query based on whether reviewPoints and reviewCategories are empty
    var query = `WITH review_status_counts AS (
        SELECT
            wrike_id,
            COUNT(*) AS total_reviews,
            COUNT(CASE WHEN rs = 'Open' THEN 1 END) AS open_count,
            COUNT(CASE WHEN rs = 'Closed' THEN 1 END) AS closed_count
        FROM
            (
                SELECT
                    wrike_id,
                    UNNEST(review_status) AS rs
                FROM
                    review_master
                WHERE
                    reviewer_name = 'Nilesh Kumar'
            ) AS subquery
        GROUP BY
            wrike_id
    )
    SELECT
        rm.wrike_id,
        rm.task_name,
        rm.reviewer_name,
        rm.review_date,
        rt.review_type,
        CASE
            WHEN open_count = 0 AND closed_count > 0 THEN ARRAY['Closed']
            WHEN closed_count = 0 AND open_count > 0 THEN ARRAY['Open']
            ELSE ARRAY['Open']
        END AS review_status,
        developer_name
    FROM
        review_master rm
    JOIN
        review_status_counts rsc ON rm.wrike_id = rsc.wrike_id
    JOIN
        review_type rt ON rt.review_type_id = rm.review_type
    WHERE
        developer_name = '${username}';`

    try {
        var result = await pool.query(query);
        if (result.rowCount > 0) {
            return { success: true, data: result.rows };
        } else {
            return { success: false, message: messages.GET_REVIEW_POINTS_FAILURE };
        }
    } catch (error) {
        console.log('Error removing review point:', error);
        logger.error(messages.DATABASE_FAILURE);
        return { success: false, message: messages.DATABASE_FAILURE };
    }
}

/**
 * @description router to get review points details for developer from the review_master table using the wrike id
 * @param  {} wrikeId
 * @param  {} 
 */

exports.GetMyReviewPointsDetails = async function (wrikeId, reviewType) {

    // Construct the query based on whether reviewPoints and reviewCategories are empty
    var query = `SELECT 
    rm.review_point,
    rm.review_category,
    rm.review_date,
    rm.review_status AS status,
    rm.developer_name,
    rm.commit_id_after,
    rm.commit_id_before,
    rm.developer_comment,
    CASE 
        WHEN rm.modified_at IS NULL THEN 'Not Updated' 
        ELSE TO_CHAR(rm.modified_at, 'YYYY-MM-DD HH24:MI:SS') 
    END AS modified_at
FROM 
    review_master rm 
WHERE 
    rm.wrike_id = '${wrikeId}' AND rm.review_type=(SELECT review_type_id from review_type WHERE review_type='${reviewType}');`

    try {
        var result = await pool.query(query);
        if (result.rowCount > 0) {
            return { success: true, data: result.rows };
        } else {
            return { success: false, message: messages.GET_REVIEW_DETAILS_FAILURE };
        }
    } catch (error) {
        console.log('Error removing review point:', error);
        logger.error(messages.DATABASE_FAILURE);
        return { success: false, message: messages.DATABASE_FAILURE };
    }
}


/**
 * @description router to get update review points status by developer in the review_master table using the wrike id and review type
 * @param  {} wrikeId
 * @param  {} 
 */

exports.UpdateDeveloperReviewPoints = async function (wrikeId, body) {
    var { reviewStatus, commitIdBefore, commitIdAfter, developerComment, reviewDate } = body;
    // Construct the query based on whether reviewPoints and reviewCategories are empty
    // Start constructing the query
    var query = `UPDATE review_master SET modified_at=current_timestamp,
                
                
                
                `;

    // Add review status if it exists
    if (reviewStatus) {
        query += ` review_status=ARRAY[${reviewStatus.map(status => `'${status}'`).join(', ')}]`;
    }

    // Add commit id before if it exists
    if (commitIdBefore) {
        query += `,commit_id_before=ARRAY[${commitIdBefore.map(commitBefore => `'${commitBefore}'`).join(', ')}]`;
    }

    // Add commit id after if it exists
    if (commitIdAfter) {
        query += `,commit_id_after=ARRAY[${commitIdAfter.map(commitAfter => `'${commitAfter}'`).join(', ')}]`;
    }

    // Add developer comment if it exists
    if (developerComment) {
        query += `,developer_comment=ARRAY[${developerComment.map(comment => `'${comment}'`).join(', ')}]`;
    }

    // Add the WHERE clause
    query += ` WHERE wrike_id = '${wrikeId}'AND TO_CHAR(review_date, 'HH24:MI:SS')='${reviewDate}'`;


    try {
        var result = await pool.query(query);
        if (result.rowCount > 0) {
            return { success: true, data: result.rows };
        } else {
            return { success: false, message: messages.UPDATE_REVIEW_DETAILS_FAILURE };
        }
    } catch (error) {
        console.log('Error removing review point:', error);
        logger.error(messages.DATABASE_FAILURE);
        return { success: false, message: messages.DATABASE_FAILURE };
    }
}


/**
 * @description router to get review status from review_status_master 
 * @param  {} 
 * @param  {} 
 */

exports.GetReviewStatus = async function () {

    // Construct the query based on whether reviewPoints and reviewCategories are empty
    var query = `SELECT status FROM review_status_master
    ;`
    try {
        var result = await pool.query(query);
        if (result.rowCount > 0) {
            return { success: true, data: result.rows };
        } else {
            return { success: false, message: messages.GET_REVIEW_STATUS_FAILURE };
        }
    } catch (error) {
        console.log('Error fetching review status :', error);
        logger.error(messages.DATABASE_FAILURE);
        return { success: false, message: messages.DATABASE_FAILURE };
    }
}
