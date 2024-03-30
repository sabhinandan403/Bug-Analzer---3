/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 30, 2024
 *
 * Module: JS file
 * Description
 * -----------------------------------------------------------------------------------
 * This file defines javascript functions that will be used to add user in application.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 30, 2024        Initially Created
 *
 * -----------------------------------------------------------------------------------
 */
 
if (!window.sessionStorage.getItem("authorization")) {
  window.location.href = "../";
}
 
//Function to load team names.
async function LoadTeamName() {
  try {
    let response = await fetch("/user/teamName", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
 
    let teamData = await response.json();
 
    if (response.ok) {
      // Get the select element
      let selectElement = document.getElementById("third");
 
      // Clear previous options
      selectElement.innerHTML = "";
 
      // Append the default option
      let defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.textContent = "Select Team";
      selectElement.appendChild(defaultOption);
 
      // Loop through the data and append options to the select element
      teamData.data.forEach((team) => {
        let option = document.createElement("option");
        option.value = team.team;
        option.textContent = team.team;
        selectElement.appendChild(option);
      });
    }
    else{
      let selectElement = document.getElementById("third");
 
      selectElement.innerHTML = "";
      // Create a default option
      let defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.textContent = "Select Projects";
      selectElement.appendChild(defaultOption);
    }
  } catch (error) {
    showToast(false, error.message);
  }
}
 
document.addEventListener("DOMContentLoaded", async function () {
  let form = document.getElementById("registerForm");
 
  let uField = form.querySelector(".userid");
  let uInput = uField.querySelector("input");
 
  let eField = form.querySelector(".email");
  let eInput = eField.querySelector("input");
 
  let pField = form.querySelector(".password");
  let pInput = pField.querySelector("input");
 
  let categoryField = form.querySelector(".employeecategory");
  let categoryInput = categoryField.querySelector("#one");
 
  let selectTeamField = form.querySelector(".selectteam");
  let selectTeamInput = selectTeamField.querySelector("#third");
 
  let addTeamField = form.querySelector(".addteam");
  let addTeamInput = addTeamField.querySelector("input");
 
  let selectProjectField = form.querySelector(".selectproject");
  let selectProjectInput = selectProjectField.querySelector("#second");
 
  let addProjectForTl= form.querySelector(".addprojectfortl");
  let addProjectForTlInput=addProjectForTl.querySelector("input");
 
  let addProjectField = form.querySelector(".addproject");
  let addProjectInput = addProjectField.querySelector("input");
 
  let addProjectFieldOfPm = form.querySelector(".addprojectforpm");
  let addProjectInputOfPm = addProjectFieldOfPm.querySelector("input");
 
  //To select multiple projects at once.
  let selectProjectsField = form.querySelector(".selectprojects");
  let checkboxContainer = document.querySelector('.checkbox-container');
 
  let iconElement = document.createElement("i");
  iconElement.className = "fas fa-users icon";
  checkboxContainer.appendChild(iconElement);
  checkboxContainer.innerHTML += "Select Project";
 
  categoryInput.addEventListener("change", function () {
 
    selectTeamInput.disabled = false;
    addTeamInput.disabled = false;
    selectProjectInput.disabled = false;
    selectProjectsField.disabled=false;
 
    selectTeamInput.style.color='#bfbfbf';
    categoryInput.style.color = 'black';
    selectProjectInput.style.color = '#bfbfbf';
   
 
    let addTeamDiv = document.querySelector('.addteam');
    let selectProject=document.querySelector('.selectproject');
    let addProject=document.querySelector('.addproject');
    let selectTeam=document.querySelector('.selectteam');
    let addprojectforpm=document.querySelector('.addprojectforpm');
    let addProjectForTl=document.querySelector('.addprojectfortl');
 
    //TL can add project and add team.
    if (categoryInput.value === "Team Lead") {
 
        addprojectforpm.style.display = 'none';
        addTeamDiv.style.display = 'none';
        selectProject.style.display = 'none';
        addProject.style.display = 'none';
       
        selectTeam.style.display = 'inline';
        selectProjectsField.style.display = 'inline';
        addProjectForTl.style.display = 'inline';
 
      LoadTeamName();
    }
    //PM can add team .
    else if (categoryInput.value === "Project Manager") {
 
        addprojectforpm.style.display='inline';
        addTeamDiv.style.display = 'inline';
   
        selectProject.style.display = 'none';
        selectTeam.style.display = 'none';
        addProject.style.display = 'none';
        addProjectForTl.style.display='none';
        selectProjectsField.style.display = 'none';
     
    } else {
 
      let addprojectforpm=document.querySelector('.addprojectforpm');
 
        selectProject.style.display = 'inline';
        selectTeam.style.display = 'inline';
 
        addTeamDiv.style.display = 'none';
        addProject.style.display = 'none';
        selectProjectsField.style.display = 'none';
        addprojectforpm.style.display = 'none';
        addProjectForTl.style.display='none';
        LoadTeamName();
    }
  });
 
  selectProjectInput.addEventListener("change", function () {
    selectProjectInput.style.color = 'black';
  })
 
  selectTeamInput.addEventListener("change", async function () {
    try {
      let team = selectTeamInput.value;
 
      selectTeamInput.style.color='black';
 
      let response = await fetch("/user/getProjectValues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team }),
      });
 
      let projectData = await response.json();
 
      if(response.ok){
        let uniqueProjects = new Set();
      // Get the select element
      let selectElement = document.getElementById("second");
 
      selectElement.innerHTML = "";
      let defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.textContent = "Select Project";
      selectElement.style.color='#bfbfbf';
      selectElement.appendChild(defaultOption);
 
      // Loop through the data and append options to the select element
 
      projectData.data.forEach((project) => {
        if (!uniqueProjects.has(project.project)) {
       
        uniqueProjects.add(project.project);
 
        let option = document.createElement("option");
        option.value = project.project;
        option.textContent = project.project;
        selectElement.appendChild(option);
        }
 
      });
    }
    else{
      let selectElement = document.getElementById("second");
     
      selectElement.innerHTML = "";
      let defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.textContent = "Select Project";
      selectElement.style.color='#bfbfbf';
      selectElement.appendChild(defaultOption);
    }
   
    } catch (error) {
        showToast(false, error.message);
    }
  });
 

  // TO SELECT MULTIPLE PROJECTS
 
  selectTeamInput.addEventListener("change", async function () {
    try {
      let team = selectTeamInput.value;
 
      let response = await fetch("/user/getProjectValues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team }),
      });
 
    let projectData = await response.json();
 
 
let checkboxContainer = document.querySelector('.checkbox-container');
checkboxContainer.innerHTML = "";
 
if (response.ok) {
 
  let iconElement = document.createElement("i");
  iconElement.className = "fas fa-users icon";
 
  checkboxContainer.appendChild(iconElement);
  checkboxContainer.innerHTML += "Select Projects";
 
  let uniqueProjects = new Set();
 
  // Create the white box container
  let whiteBox = document.createElement("div");
  whiteBox.className = "white-box";
  checkboxContainer.appendChild(whiteBox);
 
  // Create the .dropdown-list element
  let dropdownList = document.createElement("div");
  dropdownList.className = "dropdown-list";
  whiteBox.appendChild(dropdownList);
 
  projectData.data.forEach((project) => {
    if (!uniqueProjects.has(project.project)) {
      uniqueProjects.add(project.project);
 
      let checkboxOption = document.createElement("div");
      checkboxOption.className = "checkbox-option";
 
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "dropdown-group";
      checkbox.value = project.project;
 
      let labelText = document.createElement("label");
      labelText.htmlFor = project.project;
      labelText.textContent = project.project;
 
      checkboxOption.appendChild(checkbox);
      checkboxOption.appendChild(labelText);
 
      // Append to the dynamically created .dropdown-list element
      dropdownList.appendChild(checkboxOption);
    }
  })
     
    }
    else{
    let iconElement = document.createElement("i");
    iconElement.className = "fas fa-users icon";
 
    checkboxContainer.appendChild(iconElement);
 
    checkboxContainer.innerHTML += "Select Project";
    }
 
    } catch (error) {
        showToast(false, error.message);
    }
  });

  
  categoryInput.addEventListener("change", function () {
 
    eInput.value = "";
    pInput.value = "";
    uInput.value = "";
    addTeamInput.value = "";
    addProjectForTlInput.value = "";
    addProjectInputOfPm.value = "";
    addProjectInput.value = "";
 
    selectProjectInput.value = "";
    selectProjectsField.value = "";
 
    eField.classList.remove("error");
    eField.classList.remove("shake");
    pField.classList.remove("error");
    pField.classList.remove("shake");
    uField.classList.remove("error");
    uField.classList.remove("shake");
 
    selectTeamField.classList.remove("shake");
    selectTeamField.classList.remove("error");
 
    selectProjectField.classList.remove("error");
    selectProjectField.classList.remove("shake");
 
    addProjectField.classList.remove("error");
    addProjectField.classList.remove("shake");
 
    addTeamField.classList.remove("error");
    addTeamField.classList.remove("shake");
 
    let checkboxContainer = document.querySelector('.checkbox-container');
    checkboxContainer.innerHTML = "";
 
    let iconElement = document.createElement("i");
    iconElement.className = "fas fa-users icon";
 
    checkboxContainer.appendChild(iconElement);
 
    checkboxContainer.innerHTML += "Select Project";
 
  });
 
 
  //Handling form submission
  document.getElementById("registerForm").addEventListener("submit", async function (event) {
 
      event.preventDefault();
 
      eInput.value == "" ? eField.classList.add("shake", "error") : checkEmail();
      pInput.value == "" ? pField.classList.add("shake", "error") : checkPass();
      uInput.value == "" ? uField.classList.add("shake", "error") : checkUserId();
      categoryInput.value == "" ? categoryField.classList.add("shake", "error"): checkEmptyField(categoryField, categoryInput);
     
      if (!selectProjectInput.disabled) {
        selectProjectInput.value == ""
          ? selectProjectField.classList.add("shake", "error")
          : checkEmptyField(selectProjectField, selectProjectInput);
      }
      if (!selectTeamInput.disabled) {
        selectTeamInput.value == ""
          ? selectTeamField.classList.add("shake", "error")
          : checkEmptyField(selectTeamField, selectTeamInput);
      }
      if (!addTeamInput.disabled) {
        addTeamInput.value == ""
          ? addTeamField.classList.add("shake", "error")
          : checkEmptyField(addTeamField, addTeamInput);
      }
      if (!addProjectInput.disabled) {
        addProjectInput.value == ""
          ? addProjectField.classList.add("shake", "error")
          : checkEmptyField(addProjectField, addProjectInput);
      }
 
      setTimeout(() => {
        //remove shake class after 500ms
        eField.classList.remove("shake");
        pField.classList.remove("shake");
        uField.classList.remove("shake");
        categoryField.classList.remove("shake");
 
        if (!selectProjectInput.disabled) {
          selectProjectField.classList.remove("shake");
        }
        if (!selectTeamInput.disabled) {
          selectTeamField.classList.remove("shake");
        }
        if (!addTeamInput.disabled) {
          addTeamField.classList.remove("shake");
        }
        if (!addProjectInput.disabled) {
          addProjectField.classList.remove("shake");
        }
      }, 500);
 
      eInput.onkeyup = () => {
        checkEmail();
      };
      pInput.onkeyup = () => {
        checkPass();
      };
      uInput.onkeyup = () => {
        checkUserId();
      };
      categoryInput.onchange = () => {
        checkEmptyField(categoryField, categoryInput);
      };
      if (!selectProjectInput.disabled)
        selectProjectInput.onchange = () => {
          checkEmptyField(selectProjectField, selectProjectInput);
      };
      if (!selectTeamInput.disabled) {
        selectTeamInput.onchange = () => {
          checkEmptyField(selectTeamField, selectTeamInput);
        };
      }
      if (!addTeamInput.disabled) {
        addTeamInput.onchange = () => {
          checkEmptyField(addTeamField, addTeamInput);
        };
      }
      if (!addProjectInput.disabled) {
        addProjectInput.onchange = () => {
          checkEmptyField(addProjectField, addProjectInput);
        };
      }
 
      function checkEmail() {
        //checkEmail function
        let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; //pattern for validate email
        if (!eInput.value.match(pattern)) {
          //if pattern not matched then add error and remove valid class
          eField.classList.add("error");
          eField.classList.remove("valid");
          let errorTxt = eField.querySelector(".error-txt");
          //if email value is not empty then show please enter valid email else show Email can't be blank
          eInput.value != ""
            ? (errorTxt.innerText = "Enter a valid email address")
            : (errorTxt.innerText = "Email can't be blank");
        } else {
          //if pattern matched then remove error and add valid class
          eField.classList.remove("error");
          eField.classList.add("valid");
        }
      }
 
      function checkPass() {
        let passwordInput=pInput.value.trim();
 
        let pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
 
        if (!passwordInput.match(pattern)) {
          pField.classList.add("error");
          pField.classList.remove("valid");
          let errorTxt = pField.querySelector(".error-txt");
 
          passwordInput !== ""
            ? (errorTxt.innerText = "Enter Strong Password")
            : (errorTxt.innerText = "Password can't be empty");
        } else {
          pField.classList.remove("error");
          pField.classList.add("valid");
        }
      }
 
      function checkUserId() {
        var uInputValue = uInput.value.trim(); // Trim to remove leading and trailing spaces
        let errorTxt = uField.querySelector(".error-txt");
        if (uInputValue === "") {
          // If user id is empty, add error and remove valid class
          uField.classList.add("error");
          uField.classList.remove("valid");
          errorTxt.innerText = "User Id can't be empty";
        } else {
          // If user id is valid, remove error and add valid class
          uField.classList.remove("error");
          uField.classList.add("valid");
        }
      }
 
      function checkEmptyField(field, input) {
 
        if (input.value.trim() === "" && !input.disabled) {
          field.classList.add("shake", "error");
          let errorTxt = field.querySelector(".error-txt");
          errorTxt.innerText = `This field can't be empty`;
        } else {
          field.classList.remove("shake", "error");
          field.classList.add("valid");
        }
      }
 
 
 
      if (!categoryField.classList.contains("error")) {
        if (categoryInput.value === "Team Lead") {
          if (
            !eField.classList.contains("error") &&
            !pField.classList.contains("error") &&
            !uField.classList.contains("error")
          ) {
            try {
              let category = categoryInput.value;
              let email = eInput.value;
              let password = pInput.value;
              let team_lead = uInput.value;
              let team = selectTeamInput.value;
 
              let project = addProjectForTlInput.value;
 
              let checkboxes = document.querySelectorAll('.checkbox-option input[type="checkbox"]');
 
              // Array to store the selected checkbox values
              let selectedValues = [];
           
              checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                  selectedValues.push(checkbox.value);
                }
              });
 
              //To check if no project is selected.
              if (selectedValues.length === 0 && project=="") {
                showToast(false, "Select a Project");
                return;
              }
 
              //To check entered project is not present in the database.
              let duplicateProjectData = await fetch("/user/checkUniqueProject", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ project }),
              });
       
             let duplicateProject = await duplicateProjectData.json();
 
             if(duplicateProject.success){
              showToast(false, "Duplicate Project Values");
 
              setTimeout(function () {
                window.location.reload();
              }, 2500);
             
              return;
             }
 
              //To check if user entered same project as existing
 
              if (selectedValues.includes(project)) {
                showToast(false, "Duplicate Project Values");
                return;
              }
 
              // To check if selected projects already have enoufgh team leads.
 
              for(let project of selectedValues){
              let response = await fetch("/user/getTeamLeadsCount", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ project }),
              });
 
              let teamLeadCount=await response.json();
 
              if(teamLeadCount.data.length >= 3){
                showToast(false,"Only 3 team leads allowed");
 
                setTimeout(function () {
                  window.location.reload();
                }, 2500);
 
                return;
               }
              }

              if(project !="" ) {
              selectedValues.push(project);
              }
 
              let projects=selectedValues;

              if (projects.length >3){
                showToast(false, "Maximum 3 projects allowed");
                
                setTimeout(function () {
                  window.location.reload();
                }, 2500);

                return;
              }

              let payload={
                category,
                email,
                password,
                team_lead,
                team,
                projects,
              }
 
              let response = await fetch("/user/addUser", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  payload
                }),
              });
 
              let responseData = await response.json();
 
              if (responseData.success) {
                showToast(responseData.success, responseData.message);
 
                setTimeout(function () {
                  window.location.href = "/addUser";
                }, 2500);
              } else {
                showToast(responseData.success, responseData.message);
 
                setTimeout(function () {
                  window.location.reload();
                }, 2500);
              }
            } catch (error) {
              showToast(false, error.message);
 
              setTimeout(function () {
                window.location.reload();
              }, 2500);
            }
          }
        } else if (categoryInput.value === "Project Manager") {
          if (
            !eField.classList.contains("error") &&
            !pField.classList.contains("error") &&
            !uField.classList.contains("error") &&
            !addTeamField.classList.contains("error") &&
            !selectProjectInput.classList.contains("error")
          ) {
            try {
              let category = categoryInput.value;
              let email = eInput.value;
              let password = pInput.value;
              let project_manager = uInput.value;
              let team = addTeamInput.value;
             
              //If pm added a project
              let project=addProjectInputOfPm.value;
             
              
              // Common payload
              let payload = {
                    category,
                    email,
                    password,
                    project_manager,
                    team,
              };
 
              // Add extra field if addProjectInputOfPm is not null
              if (project !== "") {
                payload.project = project;
              }
 
              let response = await fetch("/user/addUser", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  payload
                }),
              });
 
              let responseData = await response.json();
 
              if (responseData.success) {
                showToast(responseData.success, responseData.message);
 
                setTimeout(function () {
                  window.location.href = "/addUser";
                }, 2500);
              } else {
                showToast(responseData.success, responseData.message);
 
                setTimeout(function () {
                  window.location.reload();
                }, 2500);
              }
            } catch (error) {
              showToast(false, error.message);
 
              setTimeout(function () {
                window.location.reload();
              }, 2500);
            }
          }
        } else if(categoryInput.value === "Developer") {
          if (
            !eField.classList.contains("error") &&
            !pField.classList.contains("error") &&
            !uField.classList.contains("error") &&
            !selectTeamField.classList.contains("error") &&
            !selectProjectField.classList.contains("error")
          ) {
            try {
              let category = categoryInput.value;
              let email = eInput.value;
              let password = pInput.value;
              let developer = uInput.value;
              let team = selectTeamInput.value;
              let project = selectProjectInput.value;
 
              let payload = {
                category,
                email,
                password,
                developer,
                team,
                project
              };
 
              let response = await fetch("/user/addUser", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  payload
                }),
              });
 
              let responseData = await response.json();
 
              if (responseData.success) {
                showToast(responseData.success, responseData.message);
 
                setTimeout(function () {
                  window.location.href = "/addUser";
                }, 2500);
              } else {
                showToast(responseData.success, responseData.message);
 
                setTimeout(function () {
                  window.location.reload();
                }, 2500);
              }
            }
            catch (error) {
              showToast(false, error.message);
 
              setTimeout(function () {
                window.location.reload();
              }, 2500);
            }
          }
        }
        else{
          if (
            !eField.classList.contains("error") &&
            !pField.classList.contains("error") &&
            !uField.classList.contains("error") &&
            !selectTeamField.classList.contains("error") &&
            !selectProjectField.classList.contains("error")
          ) {
            try {
              let category = categoryInput.value;
              let email = eInput.value;
              let password = pInput.value;
              let tester = uInput.value;
              let team = selectTeamInput.value;
              let project = selectProjectInput.value;
 
              let payload = {
                category,
                email,
                password,
                tester,
                team,
                project
              };
 
              let response = await fetch("/user/addUser", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  payload
                }),
              });
 
              let responseData = await response.json();
 
              if (responseData.success) {
                showToast(responseData.success, responseData.message);
 
                setTimeout(function () {
                  window.location.href = "/addUser";
                }, 2500);
              } else {
                showToast(responseData.success, responseData.message);
 
                setTimeout(function () {
                  window.location.reload();
                }, 2500);
              }
            }
            catch (error) {
              showToast(false, error.message);
 
              setTimeout(function () {
                window.location.reload();
              }, 2500);
            }
          }
        }
      }
 
    });
});
 
 
//Function to show swal message.
document.querySelector(".logout-button").addEventListener("click", function () {
  Swal.fire({
    title: "Are you sure you want to log out?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      window.sessionStorage.removeItem("authorization");
      window.location.href = "../";
    }
  });
});
 
 
//Generic function to show toast messages.
function showToast(success, message) {
    Toastify({
      text: message,
      duration: 2500,
      gravity: "bottom",
      position: "right",
      backgroundColor: success ? "#65B741" : "#B31312",
    }).showToast();
  }