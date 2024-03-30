/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
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
 * Yash Pathak       Jan 19, 2024        Initially Created
 * Yash Pathak       Jan 19, 2024        Added function to add new bug.
 * Yash Pathak       Jan 20, 2024        Added function to get data of all bugs.
 * Yash Pathak       Jan 21, 2024        Added function to get data of project specific bugs.
 * Yash Pathak       Jan 23, 2024        Added function to get fields data for registered bugs form.
 * Yash Pathak       Jan 30, 2024        Updated function to get project names.
 * Yash Pathak       Jan 31, 2024        Added function to Edit spefific bug data.
 * Yash Pathak       Feb 02, 2024        Added function to retrieve  spefific bug data and to retrieve all bug details of a team.
 * Yash Pathak       Feb 06, 2024        Modified function to Get all bug data from the database.
* -----------------------------------------------------------------------------------
 */


const bugsService = require("./bugs.services");
const middleware=require("../common/middleware/GenerateToken");

/**
 * Get project name data from the database to polulate it on add bug screen.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.GetProjectName = async(req,res)=>{
    try {
        let tokenData=middleware.DecodeToken(req.body.authorizationToken);
        let category=req.body.category;
        
        let getProjectNameResult = await bugsService.GetProjectNameData(tokenData,category);
        logger.info(getProjectNameResult.message);

        res.status(global.constants.OK).send({ data: getProjectNameResult.data,message: getProjectNameResult.message  });
    } catch (getProjectBugsError) {
        logger.error(global.messages.GET_PROJECT_NAME_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: getProjectBugsError.message });
    }
}



/**
 * Get bug source data from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.GetDefaultBugData = async (req, res) => {
    try {
        let getBugResult = await bugsService.GetDefaultBugData();
        logger.info(getBugResult.message);

        res.status(global.constants.OK).send({ data: getBugResult.data, message: getBugResult.message });
    } catch (getBugError) {
        logger.error(global.messages.GET_BUG_SOURCE_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: getBugError.message });
    }
}


/**
 * Add bug information to the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.AddBugInfo = async (req, res) => {
    try {
        let bugData = req.body;
        let addBugResult = await bugsService.AddBug(bugData);

        logger.info(addBugResult.message);
        if(addBugResult.success) res.status(global.constants.CREATED).send({ message: global.messages.ADD_BUG_SUCCESS });
        else res.status(global.constants.INTERNAL_SERVER_ERROR).send({ message: global.messages.ADD_BUG_FAILURE });
        
    } catch (addBugError) {
        logger.error(global.messages.ADD_BUG_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ message: global.messages.ADD_BUG_FAILURE });
    }
};


/**
 * Get all bug data from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.GetBugData = async (req, res) => {
    try {
        let token = middleware.DecodeToken(req.body.authorizationToken);
        let userCategory = req.body.userCategory;

        let getBugResult = {
            success: true,
            message: '',
            data: [] 
        };

        let getProjectName = await bugsService.GetProjectNameData(token, userCategory);

        if (userCategory == global.dbvalues.PROJECT_MANAGER) {
            let teamName = getProjectName.data[0]['team'];
            getBugResult = await bugsService.GetBugData(teamName);
        } else {
            let projectNames = getProjectName.data.map(project => project['project']);
            
            // Now here we want data of all projects inside that pm.
            for (const projectName of projectNames) {
                let projectBugResult = await bugsService.GetProjectBugCount(projectName);

                if(projectBugResult !== undefined) {
                // Accumulate projectBugResult.data into getBugResult.data
                getBugResult.data.push(...projectBugResult.data);
                }
            }
        }

        logger.info(getBugResult.message);

        if (getBugResult.success) {
            res.status(global.constants.CREATED).send({ data: getBugResult.data, message: global.messages.GET_ALL_BUGS_SUCCESS });
        } else {
            res.status(global.constants.INTERNAL_SERVER_ERROR).send({ message: getBugResult.message });
        }

    } catch (getBugError) {
        logger.error(global.messages.GET_ALL_BUGS_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ message: global.messages.GET_ALL_BUGS_FAILURE });
    }
};


/**
 * Get bug data for a specific project from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.GetProjectBugsData = async (req, res) => {
    try {
        let projectName = req.body.projectName;
        let getProjectBugResult = await bugsService.GetProjectBugsData(projectName);

        res.status(global.constants.OK).send({ data: getProjectBugResult.data,message: global.messages.GET_PROJECT_BUG_SUCCESS});
    } catch (getProjectBugsError) {
        logger.error(global.messages.GET_PROJECT_BUG_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: getProjectBugsError.message });
    }
};

/**
 * Get bug data for a specific project from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.GetSpecificBugsData = async (req, res) => {
    try {
        let bugId = req.body.bugId;
        let getProjectBugResult = await bugsService.GetSpecificBugsData(bugId);

        res.status(global.constants.OK).send({ data: getProjectBugResult.data,message: getProjectBugResult.message  });
    } catch (getProjectBugsError) {
        logger.error(global.messages.GET_BUG_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: getProjectBugsError.message });
    }
};


/**
 * Edit bug data for a specific project from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.EditBug = async (req, res) => {
    try {
        let bugData = req.body;
        let editBugResult = await bugsService.EditBug(bugData);

        if(editBugResult.success){
        res.status(global.constants.OK).send({ data: editBugResult.data,message: global.messages.EDIT_BUG_SUCCESS});
        }
        else{
        res.status(global.constants.BAD_REQUEST).send({ message: global.messages.EDIT_BUG_FAILURE});
        }
    } catch (editBugError) {
        logger.error(global.messages.EDIT_BUG_FAILURE);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: editBugError.message });
    }
};



/**
 * Check weather a bug is unique or not in database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.CheckUniqueBug = async (req, res) => {
    try {
        let bugData = req.body;
        let uniqueBugResult = await bugsService.CheckUniqueBug(bugData);

        if(uniqueBugResult.success){
        res.status(global.constants.OK).send({success: true, message: global.messages.UNIQUE_BUG_SUCCESS});
        }
        else{
        res.status(global.constants.BAD_REQUEST).send({ success: false, message: uniqueBugResult.message});
        }
    } catch (uniqueBugError) {
        logger.error(global.messages.INTERNAL_SERVER_ERROR);
        res.status(global.constants.INTERNAL_SERVER_ERROR).send({ error: uniqueBugError.message });
    }
};
