/**
 * Project Name: Bug Analyzer
 * @Project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
 *
 * Description
 * -----------------------------------------------------------------------------------
 * Contains messages for application.
 *
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Yash Pathak          Jan 19, 2024        Initially Created
 * Yash Pathak          Jan 21, 2024        Added messages for all bugs and project bug page.
 * Yash Pathak          Jan 23, 2024        Modified messages for all bugs and project bug page.
 * Yash Pathak          Jan 30, 2024        Added messages for add user and project bug page.
 * -----------------------------------------------------------------------------------
 */

module.exports = {
  MAPPER_ERROR: "Failed to create map from data",
  MAPPER_SUCCESS: "Map created successfully",

  ADD_BUG: "Adding data of bugs.",
  ADD_BUG_SUCCESS: "Bug added successfully.",
  ADD_BUG_FAILURE: "Duplicate Bug Found.",
  ADD_BUG_DB_FAILURE: "Failed to add bug inside database.",
  ADD_BUG_DB_SUCCESS: "Bug data added successfully in database.",

  GET_ALL_BUGS: "Fetching data of all bugs.",
  GET_ALL_BUGS_DB_SUCCESS: "Bug data fetched successfully from database.",
  GET_ALL_BUGS_DB_FAILURE: "Failed to fetch bugs data from database.",
  GET_ALL_BUGS_SUCCESS: "Bug data fetched successfully.",
  GET_ALL_BUGS_FAILURE: "Failed to fetch bugs data.",

  GET_PROJECT_BUGS: "Fetching data of project bugs.",
  GET_PROJECT_BUGS_DB_SUCCESS:
    "Project bugs data fetched successfully from database.",
  GET_PROJECT_BUGS_DB_FAILURE: "Failed to fetch project data from database.",
  GET_PROJECT_BUG_SUCCESS: "Project bugs fetched successfully.",
  GET_TABLE_DATA: "Fetching tables data.",

  GET_TABLE_DATA_DB_SUCCESS: "Table data fetched successfully from database",
  GET_TABLE_DATA_SUCCESS: "Table data fetched successfully",
  GET_TABLE_DATA_DB_FAILURE: "Failed to fetch table data from database",
  GET_TABLE_DATA_FAILURE: "Failed to fetch table data",
  GET_PROJECT_BUG_FAILURE: "Failed to get project bug data",
  GET_PROJECT_CATEGORY_FAILURE: "Failed to get project category data",
  GET_PROJECT_TYPE_FAILURE: "Failed to get project type data",
  GET_BUG_CATEGORY_FAILURE: "Failed to get bug category data",
  GET_BUG_SOURCE_FAILURE: "Failed to get bug source data",
  GET_PROJECT_NAME_FAILURE: "Failed to get project name data",

  DATABASE_CONNECTED: "Database Connected Successfully",
  DATABASE_SUCCESS: "Successfully added values in database",
  DATABASE_FAILURE: "Failed to add values in database",

  LOGIN_SUCCESS: "User logged in successfully",
  PASSWORD_INCORRECT: "Login Failed, Password Incorrect",
  USER_NOT_EXIT: "User does not exit",
  LOGIN_USER: "Logging user into application",
  LOGIN_FAILURE: "Failed to login user",
  ADD_USER_FAILURE: "Failed to add user",
  ADD_USER_SUCCESS: "User added successfully",
  ADDING_USER: "Adding user to application",

  GET_TEAM_SUCCESS: "Team data fetched successfully",
  GET_TEAM_FAILURE: "Failed to fetch team data",
  GET_PROJECT_SUCCESS: "Project data fetched successfully",
  GET_PROJECT_FAILURE: "Failed to fetch project data",
  
  USER_EXISTS: "User already exists",
  PROJECT_EXISTS:"Project already exists",

  DEV_SUCCESS: "Developer data fetched successfully",
  DEV_FAILURE: "Developer data fetched failed",

  UPDATE_TABLE_DATA_DB_SUCCESS: "Table data updated successfully in the database",
  UPDATE_TABLE_DATA_SUCCESS: "Table data updated successfully",
  UPDATE_TABLE_DATA_DB_FAILURE: "Failed to update table data in the database",
  UPDATE_TABLE_DATA_FAILURE: "Failed to update table data",
  UPDATE_PROJECT_BUG: "Updading data of bug.",

  GET_BUG:"Fetching data of bug.",
  GET_BUG_FAILURE:"Failed to get data of bug.",
  EDIT_BUG_FAILURE:"Failed to edit bug.",
  EDIT_BUG_SUCCESS:"Bug data updated successfully.",

  UNIQUE_PROJECT:"Project is unique",
  DUPLICATE_PROJECT:"Project is duplicate",
  TEAM_LEADS_SUCCESS:"Successfully fetched team leads",
  TEAM_LEADS_FAILURE:"Failed to fetch team leads.",
  EDIT_BUG_DATA_FAILURE:"Failed to edit bug data.",
  TEAM_LEAD_MAX_ERROR:"Maximum 3 team leads allowed",
  TEAM_MAX_ERROR:"Maximum 3 teams allowed",
  INVALID_BUG_DATA:"Bug data is invalid",
  UNIQUE_BUG_SUCCESS:"Bug Data is unique",
  UNIQUE_BUG_FAILURE:"Bug Data is duplicate",
  VALID_BUG_DATA:"Bug data is valid",

  // New Messages Added, 01/04/2024, Abhinandan Kumar, START
  REQUEST_PARAMS_NOT_FOUND: 'Request Parameters Not Found',
  GET_DEVELOPER_NAME_ERROR: "Error while getting developer name",
  INTERNAL_SERVER_ERROR:'Internal Server Error',
  GET_PROJECT_NAME_ERROR: 'Project Name not found',
  DATA_NOT_FOUND:'Data Not Found',
  GET_REVIEW_CATEGORY_FAILURE: 'Failed to get Review Category data',
  GET_REVIEW_TYPE_FAILURE: 'Failed to get Review Type data',
  BAD_REQUEST:'Bad Request',
  ADD_REVIEW_SUCCESS:'Added Review Successfully',
  ADD_REVIEW_FAILURE:'Failed to add Review points',
  INVALID_REQUEST:'Invalid Request',
  GET_REVIEW_POINTS_FAILURE: 'Cannot get review points',
  GET_REVIEW_DETAILS_FAILURE: 'Cannot get review details',
  REVIEW_REMOVE_SUCCESSFUL: 'Review Removed Successfully',
  REVIEW_REMOVE_FAILURE:'Review Removed Failed',
  DELETE_REVIEW_POINT_FAILURE:'Cannot delete point from review master table',
  UPDATE_REVIEW_POINT_FAILURE:'Cannot update point in review master table',
  UPDATE_REVIEW_DETAILS_FAILURE:'Cannot update review details',
  GET_REVIEW_STATUS_FAILURE: 'Cannot get review status failure'
};
