/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
 *
 * Module: JS file
 * Description
 * -----------------------------------------------------------------------------------
 * This file defines javascript functions that will be used to add data of a bug in application.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 19, 2024        Initially Created
 * Yash Pathak       Jan 21, 2024        Added support for validation messages.
 * Yash Pathak       Jan 22, 2024        Added support for toast messages.
 *
 * -----------------------------------------------------------------------------------
 */

if (
  !window.sessionStorage.getItem("pmAuthorization") &&
  !window.sessionStorage.getItem("tlAuthorization") &&
  !window.sessionStorage.getItem("tesAuthorization")
) {
  window.location.href = "../userLogin";
}

document.addEventListener("DOMContentLoaded", function () {

  localStorage.removeItem("responseData");
  localStorage.removeItem("specificBugData");


    let authorizationToken ="";
    let category="";

    if(window.sessionStorage.getItem("tesAuthorization")){
      category = "Tester";
      authorizationToken = window.sessionStorage.getItem("tesAuthorization");
    } 
    else if(window.sessionStorage.getItem("pmAuthorization")){
      category = "Project Manager";
      authorizationToken = window.sessionStorage.getItem("pmAuthorization");
    } 
    else if(window.sessionStorage.getItem("tlAuthorization")){
      category = "Team Lead";
      authorizationToken = window.sessionStorage.getItem("tlAuthorization");
    } 

  function showRcaFields() {
    var bugCategory = document.getElementById("bugCategory");
    var rcaField1 = document.getElementById("rcaField1");
    var rcaField2 = document.getElementById("rcaField2");
    var rcaField3 = document.getElementById("rcaField3");

    if (bugCategory.value === "Major" || bugCategory.value === "Critical") {
      rcaField1.classList.remove("hidden");
      rcaField2.classList.remove("hidden");
      rcaField3.classList.remove("hidden");
    } else {
      rcaField1.classList.add("hidden");
      rcaField2.classList.add("hidden");
      rcaField3.classList.add("hidden");
    }
  }


  document.getElementById("bugCategory").addEventListener("click", () => {
    showRcaFields();
  });


  
  async function submitBugsForm(bugsData) {
    let project_name = bugsData[0];
    let bug_source = bugsData[1];
    let bug_description = bugsData[2];
    let type_of_issue = bugsData[3];
    let bug_category = bugsData[4];
    let root_cause = bugsData[5];
    let action_to_prevent = bugsData[6];
    let remarks = bugsData[7];
    let bug_status = "Stack";
    let assigned_to = "";
    let developer_comment = "";
    let created_by = bugsData[8];
    
    let response = await fetch("/bugs/registerBug", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_name,
        bug_source,
        bug_description,
        type_of_issue,
        bug_category,
        root_cause,
        action_to_prevent,
        remarks,
        bug_status,
        assigned_to,
        developer_comment,
        created_by
      }),
    });

    let responseData = await response.json();

    if (response.status === 201) {
      showToast(responseData.message, "#65B741");
    } else {
      showToast(responseData.message, "#B31312");
    }
  }


  document.getElementById("submitBtn").addEventListener("click", async function (event) {
      event.preventDefault();

      let form = document.querySelector("form");

      let projectField = form.querySelector(".project");
      let projectFieldInput = projectField.querySelector("select");

      let bugSource = form.querySelector(".bugsource");
      let bugSourceInput = bugSource.querySelector("select");

      let bugDesc = form.querySelector(".bugdescription");
      let bugDescInput = bugDesc.querySelector("textarea");

      let bugType = form.querySelector(".bugtype");
      let bugTypeInput = bugType.querySelector("select");

      let bugCategory = form.querySelector(".bugcategory");
      let bugCategoryInput = bugCategory.querySelector("select");

      function clearError(field) {
        field.classList.remove("error");
        field.classList.add("valid");
        let errorTxt = field.querySelector(".error-txt");
        errorTxt.innerText = "";
      }

      function checkField(input, field) {
        let errorTxt = field.querySelector(".error-txt");

        if (input.value.trim() === "") {
          field.classList.add("shake", "error");

          if (input.id === "bugDescription")
            errorTxt.innerText = `Bug Description can't be empty`;
          else if (input.id === "rootCause")
            errorTxt.innerText = `Root Cause must be between 10 and 100 characters.`;
          else if (input.id === "actionToPrevent")
            errorTxt.innerText = `Actions to prevent must be between 10 and 100 characters.`;
          else if (input.id === "remarks")
            errorTxt.innerText = `Remarks can't be empty`;
          else errorTxt.innerText = `This field can't be empty`;
        } else {
          clearError(field);
        }
      }

      projectFieldInput.value == ""
        ? projectField.classList.add("shake", "error")
        : checkField(projectFieldInput, projectField);
      bugSourceInput.value == ""
        ? bugSource.classList.add("shake", "error")
        : checkField(bugSourceInput, bugSource);
      bugDescInput.value == ""
        ? bugDesc.classList.add("shake", "error")
        : checkField(bugDescInput, bugDesc);
      bugTypeInput.value == ""
        ? bugType.classList.add("shake", "error")
        : checkField(bugTypeInput, bugType);
      bugCategoryInput.value == ""
        ? bugCategory.classList.add("shake", "error")
        : checkField(bugCategoryInput, bugCategory);

      projectFieldInput.onchange = () => {
        checkField(projectFieldInput, projectField);
      };
      bugSourceInput.onchange = () => {
        checkField(bugSourceInput, bugSource);
      };
      bugDescInput.onchange = () => {
        checkField(bugDescInput, bugDesc);
      };
      bugTypeInput.onchange = () => {
        checkField(bugTypeInput, bugType);
      };
      bugCategoryInput.onchange = () => {
        checkField(bugCategoryInput, bugCategory);
      };

      bugDescInput.oninput = () => {
        bugDescInput.value = bugDescInput.value.replace(/^\s+/g, ""); // Remove leading spaces
        checkField(bugDescInput, bugDesc);
        if (
          bugDescInput.value.trim().length < 10 ||
          bugDescInput.value.trim().length > 100
        ) {
          bugDesc.classList.add("shake", "error");
          let errorTxt = bugDesc.querySelector(".error-txt");
          errorTxt.innerText =
            "Bug Description must be between 10 and 100 characters.";
        } else {
          clearError(bugDesc);
        }
      };

      bugDescInput.onchange = () => {
        bugDescInput.value = bugDescInput.value.replace(/^\s+/g, "");
        checkField(bugDescInput, bugDesc);
      };

      if (
        bugDescInput.value.trim().length < 10 ||
        bugDescInput.value.trim().length > 100
      ) {
        bugDesc.classList.add("shake", "error");
        let errorTxt = bugDesc.querySelector(".error-txt");
        errorTxt.innerText =
          "Bug Description must be between 10 and 100 characters.";
      }

      let rootCause = "",
        actionToPrevent = "",
        rootCauseInput = "",
        actionToPreventInput = "",
        remarksInput = "";

      var rcaField1 = document.getElementById("rcaField1");

      if (!rcaField1.classList.contains("hidden")) {
        rootCause = form.querySelector(".rootcause");
        rootCauseInput = rootCause.querySelector("textarea");
        rootCauseInput.value == ""
          ? rootCause.classList.add("shake", "error")
          : checkField(rootCauseInput, rootCause);
        rootCauseInput.onchange = () => {
          checkField(rootCauseInput, rootCause);
        };

        rootCauseInput.oninput = () => {
          rootCauseInput.value = rootCauseInput.value.replace(/^\s+/g, ""); // Remove leading spaces
        };

        rootCauseInput.onchange = () => {
          rootCauseInput.value = rootCauseInput.value.replace(/^\s+/g, ""); // Remove leading spaces
          checkField(rootCauseInput, rootCause);
        };

        if (
          rootCauseInput.value.trim().length < 10 ||
          rootCauseInput.value.trim().length > 100
        ) {
          rootCause.classList.add("shake", "error");
          let errorTxt = rootCause.querySelector(".error-txt");
          errorTxt.innerText =
            "Root Cause must be between 10 and 100 characters.";
        }

        actionToPrevent = form.querySelector(".actiontoprevent");
        actionToPreventInput = actionToPrevent.querySelector("textarea");
        actionToPreventInput.value == ""
          ? actionToPrevent.classList.add("shake", "error")
          : checkField(actionToPreventInput, actionToPrevent);
        actionToPreventInput.onchange = () => {
          checkField(actionToPreventInput, actionToPrevent);
        };

        actionToPreventInput.oninput = () => {
          actionToPreventInput.value = actionToPreventInput.value.replace(
            /^\s+/g,
            ""
          ); // Remove leading spaces
        };

        actionToPreventInput.onchange = () => {
          actionToPreventInput.value = actionToPreventInput.value.replace(
            /^\s+/g,
            ""
          ); // Remove leading spaces
          checkField(actionToPreventInput, actionToPrevent);
        };

        if (
          actionToPreventInput.value.trim().length < 10 ||
          actionToPreventInput.value.trim().length > 100
        ) {
          actionToPrevent.classList.add("shake", "error");
          let errorTxt = actionToPrevent.querySelector(".error-txt");
          errorTxt.innerText =
            "Actions to prevent must be between 10 and 100 characters.";
        }

        bugRemarks = form.querySelector(".remarks");
        remarksInput = bugRemarks.querySelector("textarea");
        remarksInput.value == ""
          ? bugRemarks.classList.add("shake", "error")
          : checkField(remarksInput, bugRemarks);
        remarksInput.onchange = () => {
          checkField(remarksInput, bugRemarks);
        };

        remarksInput.oninput = () => {
          remarksInput.value = remarksInput.value.replace(/^\s+/g, ""); // Remove leading spaces
        };

        remarksInput.onchange = () => {
          remarksInput.value = remarksInput.value.replace(/^\s+/g, ""); // Remove leading spaces
          checkField(remarksInput, bugRemarks);
        };
      }

      if (
        !projectField.classList.contains("error") &&
        !bugSource.classList.contains("error") &&
        !bugDesc.classList.contains("error") &&
        !bugType.classList.contains("error") &&
        !bugCategory.classList.contains("error")
      ) {
        let project_name = projectFieldInput.value;
        let bug_source = bugSourceInput.value;
        let bug_description = bugDescInput.value;
        let type_of_issue = bugTypeInput.value;
        let bug_category = bugCategoryInput.value;
        
        //RCA Fields
        let root_cause = rootCauseInput.value !== undefined ? rootCauseInput.value : "";
        let action_to_prevent = actionToPreventInput.value !== undefined  ? actionToPreventInput.value : "";
        let remarks = remarksInput.value !== undefined ? remarksInput.value : "";
        
        let created_by=authorizationToken;

        let bugsData = [
          project_name,
          bug_source,
          bug_description,
          type_of_issue,
          bug_category,
          root_cause,
          action_to_prevent,
          remarks,
          created_by
        ];

        //Check for root cause analysis fields.
        if (!rcaField1.classList.contains("hidden")) {
          if (
            !rootCause.classList.contains("error") &&
            !actionToPrevent.classList.contains("error") &&
            !bugRemarks.classList.contains("error")
          ) {
            submitBugsForm(bugsData);
          }
        } else {
          submitBugsForm(bugsData);
        }
      }
    });

    var usertype = localStorage.getItem("usertype");
    if(usertype === 'tester'){
      document.getElementById('addReview').style.display = 'none';
    }

  document.getElementById("resetBtn").addEventListener("click", function () {
    window.location.href = "./addBug";
  });

});