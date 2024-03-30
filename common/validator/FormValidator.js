/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Feb 18, 2024
 *
 * Module: Bug Routes
 * Description
 * -----------------------------------------------------------------------------------
 * Services file to validate the form data.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Feb 17, 2024        Initially Created
 * -----------------------------------------------------------------------------------
 */


exports.CheckEditedData=(newBugData,oldBugData)=>{

    //Old data of bug.
    let initialBugSource=oldBugData.bug_source;
    let initialBugDesc=oldBugData.bug_description;
    let initialBugType=oldBugData.bug_type;
    let initialBugCategory=oldBugData.bug_category;
    let initialRootCause=oldBugData.root_cause;
    let initialActionToPrevent=oldBugData.action_to_prevent;
    let initialRemarks=oldBugData.remarks;
    let initialBugStatus=oldBugData.bug_status;
    let initialAssignTo=oldBugData.assigned_to;
    initialAssignTo = initialAssignTo === null ? "" : initialAssignTo;

    //New data of bug.
    let bugSource=newBugData.bugSource;
    let bugDescription=newBugData.bugDescription;
    let bugType=newBugData.bugType;
    let bugCategory=newBugData.bugCategory;
    let rootCause =newBugData.rootCause;
    let actionToPrevent = newBugData.actionToPrevent;
    let remarks = newBugData.remarks;
    let assignedTo=newBugData.assignedTo;
    let bugStatus=newBugData.bugStatus;

    if (
        bugSource === initialBugSource &&
        bugDescription === initialBugDesc &&
        bugType === initialBugType &&
        bugCategory === initialBugCategory &&
        rootCause === initialRootCause &&
        actionToPrevent === initialActionToPrevent &&
        remarks === initialRemarks  && assignedTo===initialAssignTo && bugStatus === initialBugStatus) {

        return false;
    }

    return true;
}

exports.CheckValidBug=(bugData)=>{

      let isStringLengthValid = (value, minLength, maxLength) => {
        let trimmedValue = value.trim() !== "" ? value.trim() : value;
        return trimmedValue.length >= minLength && trimmedValue.length <= maxLength;
      };

      let uniqueProjects=bugData.uniqueProjects;
      let projectName=bugData.project_name;

      if(!uniqueProjects.includes(projectName)){
        return false;
      }

      if (!isStringLengthValid(bugData.bug_description, 10, 100)) {
        return false;
      }
    
      let validBugTypes = ["Functionality", "Blocker", "Graphics", "Editorial","Suggestion"];
      if (!validBugTypes.includes(bugData.type_of_issue)) {
        return false;
      }
    
      let validBugStatus = ["Open", "Closed", "Reopen", "Deffered","Fixed","Can't Fix","Not a bug","Stack"];
      if (!validBugStatus.includes(bugData.bug_status)) {
        return false;
      }
    
      return true;
}