/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 23, 2024
 *
 * Module: JS file
 * Description
 * -----------------------------------------------------------------------------------
 * This file defines javascript functions to load form data in register bug form dropdown.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 23, 2024        Initially Created
 *
 * -----------------------------------------------------------------------------------
 */


document.addEventListener('DOMContentLoaded', function () {

    async function LoadProjectName(authorizationToken,category) {
        try {

            let response = await fetch("/bugs/projectName", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({authorizationToken,category})
            });

            let data = await response.json();

            // Get the select element
            let selectElement = document.getElementById("projectName");
            let uniqueProjects = new Set();

            // Loop through the data and append options to the select element
            data.data.forEach(project => {
                if (!uniqueProjects.has(project.project)) {
                uniqueProjects.add(project.project);
                let option = document.createElement("option");
                option.value = project.project;
                option.textContent = project.project;
                selectElement.appendChild(option);
                }
            });

        } catch (error) {
            console.error("Error loading Project Names:", error);
        }
    }

    async function LoadDefaultBugData() {
        try {
            const response = await axios.get("/bugs/defaultBugData", {
                headers: {
                  "Content-Type": "application/json",
                },
              });
          
            let defaultBugData=response.data;


            let selectSourceElement = document.getElementById("bugSource");
            let sourceValues=defaultBugData.data[0].data.source;

            // Loop through the data and append options to the select element
            sourceValues.forEach(bugSource => {
                let option = document.createElement("option");
                option.value = bugSource;
                option.textContent = bugSource;
                selectSourceElement.appendChild(option);
            });
        

            let selectCategoryElement = document.getElementById("bugCategory");
            let categoryValues=defaultBugData.data[1].data.category;


            categoryValues.forEach(bugCategory => {
                let option = document.createElement("option");
                option.value = bugCategory;
                option.textContent = bugCategory;
                selectCategoryElement.appendChild(option);
            });


            let selectTypeElement = document.getElementById("bugType");
            let typeValues=defaultBugData.data[2].data.type;


            // Loop through the data and append options to the select element
            typeValues.forEach(bugType => {
                let option = document.createElement("option");
                option.value = bugType;
                option.textContent = bugType;
                selectTypeElement.appendChild(option);
            });


        } catch (error) {
            console.error("Error loading Bug Categories:", error);
        }
    }


    if(sessionStorage.getItem("pmAuthorization")){
        let pmAuthorizationToken = sessionStorage.getItem("pmAuthorization");
        let category='Project Manager';

        LoadProjectName(pmAuthorizationToken,category);
    }

    if(sessionStorage.getItem("tlAuthorization")){
        let tlAuthorizationToken = sessionStorage.getItem("tlAuthorization");
        let category='Team Lead';

        LoadProjectName(tlAuthorizationToken,category);
    }

    if(sessionStorage.getItem("tesAuthorization")){
        let tesAuthorizationToken = sessionStorage.getItem("tesAuthorization");
        let category='Tester';

        LoadProjectName(tesAuthorizationToken,category);
    }


    LoadDefaultBugData();
});