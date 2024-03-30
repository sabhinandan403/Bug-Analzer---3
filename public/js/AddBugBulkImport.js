document.addEventListener("DOMContentLoaded", function () {

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
        
  //TO ADD BUG USING BULK IMPORT

  var importButton = document.querySelector(".import-button");

  importButton.addEventListener("click", async function () {
    // Create a file input element
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.name = "excelFile";
    fileInput.accept = ".xlsx, .xls";

    fileInput.click();

    fileInput.addEventListener("change", async function () {
      // Create a FormData object
      var formData = new FormData();

      formData.append("excelFile", fileInput.files[0]);

      // Access the file data from FormData using a FileReader (reading the file data)
      var reader = new FileReader();

      // Sets up an event listener for when the file reading is complete. 
      // The event.target.result contains the file data as a binary string.
      reader.onload = async function (event) {
  
        var binaryString = event.target.result;

        // Using the xlsx library to parse the binary string into a workbook object.
        var workbook = XLSX.read(binaryString, { type: "binary" });

        // Retrieves the name of the first sheet and converts the sheet data into a JavaScript object using sheet_to_json method.
        var firstSheetName = workbook.SheetNames[0];

        // Passed the option { raw: true, defval: "" } to include empty cells
        var excelData = XLSX.utils.sheet_to_json(
          workbook.Sheets[firstSheetName],
          { raw: true, defval: "" }
        );

        // Loops through each row of the Excel data 
        excelData.forEach(function (row) {
          // Assuming the first field is named 'firstField', replace double quotes
          if (row.hasOwnProperty('firstField')) {
              row.firstField = row.firstField.replace(/"/g, '').trim();
          }
        });



        //Fetching project data under specific user.

        let projectData = await fetch("/bugs/projectName", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ authorizationToken, category }),
        });



        let projectNames = await projectData.json();

        let dataArray=projectNames.data;
        let uniqueProjects = [...new Set(dataArray.map(item => item.project))];

        let processedBugData = [];
        let count=1;

        if(excelData.length > 0){

        for (bugData of excelData) {

          let project_name = bugData["Project Name"];
          let bug_description = bugData["Bug Description"];
          // let test_result = bugData["Test Result"];
          let type_of_issue = bugData["Type of Issue"];
          let bug_status = bugData["Status"];
          let assigned_to = bugData["Assign To"] !== '" "' ? bugData["Assign To"] : "";
          let developer_comment = bugData["Developer Comment"] !== '" "' ? bugData["Developer Comment"] : "";

          // If any column heading is missing or incorrect.

          function checkAndShowToast(variable, fieldName, count) {
            if (typeof variable === 'undefined') {
              showToast(`Invalid ${fieldName} at row ${count}`, "#B31312");
              return true; 
            }
            return false;
          }
          
          if (
            checkAndShowToast(project_name, "Project Name heading", count) ||
            checkAndShowToast(bug_description, "Bug Description heading", count) ||
            // checkAndShowToast(test_result, "Test Result heading", count) ||
            checkAndShowToast(type_of_issue, "Type Of Issue heading", count) ||
            checkAndShowToast(bug_status, "Bug Status heading", count) ||
            checkAndShowToast(assigned_to, "Assign To heading", count) ||
            checkAndShowToast(developer_comment, "Developer Comment heading", count)
          ) {
            return;
          }
          
          //If project name entered is different/incorrect from the users scope.
          if (!uniqueProjects.includes(project_name)) {
            showToast(`Invalid Project name at row ${count}`, "#B31312");
            return;
          }

          //If exel file has duplicate bug data.
          if (
            processedBugData.some((processedBug) =>
              compareBugData(processedBug, bugData)
            )
          ) {
            showToast(`Duplicate bug data at row ${count}`, "#B31312");
            return;
          }

          //If everything is fine, then check for unique and valid bug.

          let response = await fetch("/bugs/uniqueBug", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              project_name,
              bug_description,
              type_of_issue,
              bug_status,
              uniqueProjects
            }),
          });

          let responseData = await response.json();

          if (!responseData.success) {
            showToast(`${responseData.message} at row ${count}`, "#B31312");
            return;
          }

          processedBugData.push(bugData);

          function compareBugData(bugData1, bugData2) {
            return (
              bugData1["Project Name"] === bugData2["Project Name"] &&
              bugData1["Bug Description"] === bugData2["Bug Description"] &&
              bugData1["Test Result"] === bugData2["Test Result"] &&
              bugData1["Type of Issue"] === bugData2["Type of Issue"]
            );
          }

          count++;
        }
      }
      else{
        showToast("File is empty", "#B31312");
            return;
      }

        // Function to submit bug data if bug data is correct and unique.

        async function submitBugData(bugData) {

          let project_name = bugData["Project Name"];
          let bug_source="Internal"
          let bug_description = bugData["Bug Description"];
          let type_of_issue = bugData["Type of Issue"];

          let bug_category = "Low";
          let root_cause = "";
          let action_to_prevent= "";
          let remarks = "";

          let bug_status = bugData["Status"];
          let assigned_to = bugData["Assign To"] !== '" "' ? bugData["Assign To"] : "";
          let developer_comment = bugData["Developer Comment"] !== '" "' ? bugData["Developer Comment"] : "";

          let created_by=authorizationToken;
          // let test_result = bugData["Test Result"];

         
        

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

          if (response.status === 201) {
            return true; 
          } else {
            return false; 
          }
        }

        // Define a function to handle the submission of bug data array
        async function submitAllBugsData(excelData) {
          try {
            for (const bugData of excelData) {
              const success = await submitBugData(bugData);
              if (!success) {
                // If any submission fails, stop and show an error message
                showToast("Bug data submission failed", "#B31312");
                return;
              }
            }
            
            showToast("All bugs entered successfully!", "#65B741");
          } catch (error) {
            // Handle any unexpected errors
            console.error("Error:", error);
            showToast("An error occurred", "#B31312");
          }
        }

        submitAllBugsData(excelData);
      };
      // Read the content of the file as a binary string
      reader.readAsBinaryString(fileInput.files[0]);
    });
  });

});