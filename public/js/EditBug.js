/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Feb 15, 2024
 *
 * Module: JS file
 * Description
 * -----------------------------------------------------------------------------------
 * This file defines javascript functions that will be used to edit data of a bug in application.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Feb 15, 2024        Initially Create
 *
 * -----------------------------------------------------------------------------------
 */

if (
    !localStorage.getItem("specificBugData") ||
    (!window.sessionStorage.getItem("pmAuthorization") &&
      !window.sessionStorage.getItem("tlAuthorization")) && 
      !window.sessionStorage.getItem("tesAuthorization")){
       
       window.location.href = "../userLogin";
}

async function LoadDefaultBugData(bugCategory,bugType,bugSource) {
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
        selectSourceElement.value=bugSource;
    

        let selectCategoryElement = document.getElementById("bugCategory");
        let categoryValues=defaultBugData.data[1].data.category;


        categoryValues.forEach(bugCategory => {
            let option = document.createElement("option");
            option.value = bugCategory;
            option.textContent = bugCategory;
            selectCategoryElement.appendChild(option);
        });
        selectCategoryElement.value=bugCategory;


        let selectTypeElement = document.getElementById("bugType");
        let typeValues=defaultBugData.data[2].data.type;


        // Loop through the data and append options to the select element
        typeValues.forEach(bugType => {
            let option = document.createElement("option");
            option.value = bugType;
            option.textContent = bugType;
            selectTypeElement.appendChild(option);
        });

        selectTypeElement.value=bugType

    } catch (error) {
        console.error("Error loading Bug Categories:", error);
    }
}


//Function that will prefill the values in form.
document.addEventListener('DOMContentLoaded',async function(){

    let data=JSON.parse(localStorage.getItem("specificBugData"));
    let bugData=data.rowData
    let project=data.projectName
   
    let bugSource=bugData[1];
    let bugDesc=bugData[2];
    let bugType=bugData[3];
    let bugCategory=bugData[4];
    let rootCause=bugData[5];
    let actionToPrevent=bugData[6];
    let remarks=bugData[7];
    let bugStatus=bugData[10];
    let assignedTo=bugData[11];

    LoadDefaultBugData(bugCategory,bugType,bugSource)

    document.getElementById('bugDescription').value = bugDesc;
    document.getElementById('rootCause').value = rootCause;
    document.getElementById('actionToPrevent').value = actionToPrevent;
    document.getElementById('remarks').value = remarks;
    showRcaFields(bugCategory);


    let developerData = await axios.post("/user/developerData", { project }, 
    {
        headers: {
            "Content-Type": "application/json",
        },
    });


    let devData=developerData.data.data;

    let assignToDropdown = document.getElementById('assignTo');

    let assignToDiv= document.querySelector('.assignto');
    if (!window.sessionStorage.getItem("tesAuthorization")) {
    devData.forEach(developer => {
        let option = document.createElement("option");
        option.value = developer.developer;
        option.textContent = developer.developer;
        if (option.value !== assignedTo) {
            assignToDropdown.appendChild(option);
        } else {
            option.selected = true; // Select the pre-filled value
            option.disabled = true; // Disable the pre-filled option
            assignToDropdown.appendChild(option);
        }
    });
    }
    else{
        assignToDiv.style.display = "none";
    }

    let bugStatusArray = ["STACK", "ON HOLD", "STUCK", "CLOSED"];

    let bugStatusDropdown = document.getElementById('bugStatus');
    bugStatusArray.forEach(project => {
        let option = document.createElement("option");
        option.value = project;
        option.textContent = project;
        if (option.value !== bugStatus) {
            bugStatusDropdown.appendChild(option);
        } else {
            option.selected = true; // Select the pre-filled value
            // option.disabled = true; // Disable the pre-filled option
            bugStatusDropdown.appendChild(option);
        }
    });

});


function showRcaFields(bugCategory) {
    var rcaField1 = document.getElementById('rcaField1');
    var rcaField2 = document.getElementById('rcaField2');
    var rcaField3 = document.getElementById('rcaField3');
    
    if (bugCategory === 'Major' || bugCategory === 'Critical') {
        rcaField1.classList.remove('hidden');
        rcaField2.classList.remove('hidden');
        rcaField3.classList.remove('hidden');
    } else {
        rcaField1.classList.add('hidden');
        rcaField2.classList.add('hidden');
        rcaField3.classList.add('hidden');
    }
}

async function submitBugsForm(data){

    //Initial form data.
    let initialData=JSON.parse(localStorage.getItem("specificBugData"));
    let bugData=initialData.rowData
   
    let initialBugSource=bugData[1];
    let initialBugDesc=bugData[2];
    let initialBugType=bugData[3];
    let initialBugCategory=bugData[4];
    let initialRootCause=bugData[5];
    let initialActionToPrevent=bugData[6];
    let initialRemarks=bugData[7];
    let initialBugStatus=bugData[10];
    let initialAssignTo=bugData[11];
    initialAssignTo = initialAssignTo === null ? "" : initialAssignTo;

    //New form data.
    let bugSource=data[0];
    let bugDescription=data[1];
    let bugType=data[2];
    let bugCategory=data[3];
    let rootCause =data[4];
    let actionToPrevent = data[5];
    let remarks = data[6];
    let assignedTo=data[7];

    //If tester is logged in, then he cannot assign the bug to anyone.
    if (window.sessionStorage.getItem("tesAuthorization")) assignedTo=initialAssignTo;
    let bugStatus=data[8];
    
    bugStatus = bugStatus === "" ? "STACK" : bugStatus;

    let bugId=bugData[0];

    if (
        bugSource === initialBugSource &&
        bugDescription === initialBugDesc &&
        bugType === initialBugType &&
        bugCategory === initialBugCategory &&
        rootCause === initialRootCause &&
        actionToPrevent === initialActionToPrevent &&
        remarks === initialRemarks  && assignedTo===initialAssignTo && bugStatus === initialBugStatus) {
        Toastify({
            text: "No changes were made",
            duration: 2500,
            gravity: "bottom",
            position: "right",
            backgroundColor: "#B31312",
        }).showToast();

        return;
    }

    //API to submit the form and update values.
    else{

    let payload={
        bugId,bugSource, bugDescription, bugType, bugCategory, rootCause, actionToPrevent,remarks,assignedTo,bugStatus
    }

  try {
    let responseData = await axios.post("/bugs/editBug", payload, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log(responseData);

    if (responseData.status === 200) {
        // Success case
        Toastify({
            text: responseData.data.message,
            duration: 2500,
            gravity: "bottom",
            position: "right",
            backgroundColor: "#65B741",
        }).showToast();

        setTimeout(function () {
            window.location.href = "./projectBugsInfo";
        }, 2500);
    } else {
        Toastify({
            text: responseData.data.message,
            duration: 2500,
            gravity: "bottom",
            position: "right",
            backgroundColor: "#B31312",
        }).showToast();

        setTimeout(function () {
            window.location.href = "./projectBugsInfo";
        }, 2500);
    }
} catch (error) {
    Toastify({
        text: "Failed to update bug data",
        duration: 2500,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#B31312",
    }).showToast();

    setTimeout(function () {
        window.location.href = "./projectBugsInfo";
    }, 2500);
}
}
}


// TO SHOW RCA FIELDS
document.getElementById("bugCategory").addEventListener('click',()=>{
    let form = document.querySelector("form");
    let bugCategory= form.querySelector(".bugcategory");
    let bugCategoryInput= bugCategory.querySelector("select");

    showRcaFields(bugCategoryInput.value)
})


document.getElementById("submitBtn").addEventListener('click', async function(event) {
    event.preventDefault();

    let form = document.querySelector("form");

    let bugSource = form.querySelector(".bugsource");
    let bugSourceInput = bugSource.querySelector("select");
    
    let bugDesc= form.querySelector(".bugdescription");
    let bugDescInput = bugDesc.querySelector("textarea");

    let bugType=form.querySelector(".bugtype");
    let bugTypeInput= bugType.querySelector("select");

    let bugCategory= form.querySelector(".bugcategory");
    let bugCategoryInput= bugCategory.querySelector("select");

    let assignedTo= form.querySelector(".assignto");
    let assignedToInput = assignedTo.querySelector("select");

    let bugStatus = form.querySelector(".bugstatus");
    let bugStatusInput=bugStatus.querySelector("select");


    function clearError(field) {
        field.classList.remove("error");
        field.classList.add("valid");
        let errorTxt = field.querySelector(".error-txt");
        errorTxt.innerText = "";
    }



    function checkField(input, field) {
        let errorTxt = field.querySelector(".error-txt");
    
        if (input.value.trim() === "") {
          field.classList.add("shake", "error")

          if(input.id==="bugDescription") errorTxt.innerText = `Bug Description can't be empty`;
          else if(input.id==="rootCause") errorTxt.innerText = `Root Cause must be between 10 and 100 characters.`;
          else if(input.id==="actionToPrevent")errorTxt.innerText = `Actions to prevent must be between 10 and 100 characters.`;
          else if(input.id==="remarks")errorTxt.innerText = `Remarks can't be empty`;
          else errorTxt.innerText=`This field can't be empty`;
          
        } else {
          clearError(field);
        }
    }
  
    (bugSourceInput.value == "") ? bugSource.classList.add("shake", "error") : checkField(bugSourceInput,bugSource);
    (bugDescInput.value == "") ? bugDesc.classList.add("shake", "error") : checkField(bugDescInput,bugDesc);
    (bugTypeInput.value == "") ? bugType.classList.add("shake", "error") : checkField(bugTypeInput,bugType);
    (bugCategoryInput.value == "") ? bugCategory.classList.add("shake", "error") : checkField(bugCategoryInput,bugCategory);

    bugSourceInput.onchange = () => { checkField(bugSourceInput,bugSource)}
    bugDescInput.onchange = () => { checkField(bugDescInput,bugDesc)}
    bugTypeInput.onchange = () => { checkField(bugTypeInput, bugType) }
    bugCategoryInput.onchange = () => { checkField(bugCategoryInput, bugCategory) }


    bugDescInput.oninput = () => {
        bugDescInput.value = bugDescInput.value.replace(/^\s+/g, ''); // Remove leading spaces
        checkField(bugDescInput, bugDesc);
        if (bugDescInput.value.trim().length < 10 || bugDescInput.value.trim().length > 100) {
            bugDesc.classList.add("shake", "error");
            let errorTxt = bugDesc.querySelector(".error-txt");
            errorTxt.innerText = "Bug Description must be between 10 and 100 characters.";
        } else {
            clearError(bugDesc);
        }
    };
    
    bugDescInput.onchange = () => { 
        bugDescInput.value = bugDescInput.value.replace(/^\s+/g, '');
        checkField(bugDescInput, bugDesc);
    }

    if (bugDescInput.value.trim().length < 10 || bugDescInput.value.trim().length > 100) {
        bugDesc.classList.add("shake", "error");
        let errorTxt = bugDesc.querySelector(".error-txt");
        errorTxt.innerText = "Bug Description must be between 10 and 100 characters.";
    }

    let rootCause = "", actionToPrevent = "",remarks = "", rootCauseInput="", actionToPreventInput="", remarksInput="";

    var rcaField1 = document.getElementById('rcaField1');

    
    if (!rcaField1.classList.contains("hidden")) {

        rootCause= form.querySelector(".rootcause");
        rootCauseInput= rootCause.querySelector("textarea");
        (rootCauseInput.value == "") ? rootCause.classList.add("shake", "error") : checkField(rootCauseInput,rootCause);
        rootCauseInput.onchange = () => { checkField(rootCauseInput, rootCause) }

        rootCauseInput.oninput = () => { 
            rootCauseInput.value = rootCauseInput.value.replace(/^\s+/g, ''); // Remove leading spaces
        }
        
        rootCauseInput.onchange = () => { 
            rootCauseInput.value = rootCauseInput.value.replace(/^\s+/g, ''); // Remove leading spaces
            checkField(rootCauseInput, rootCause);
        }

        if (rootCauseInput.value.trim().length < 10 || rootCauseInput.value.trim().length > 100) {
            rootCause.classList.add("shake", "error");
            let errorTxt = rootCause.querySelector(".error-txt");
            errorTxt.innerText = "Root Cause must be between 10 and 100 characters.";
        }

        actionToPrevent= form.querySelector(".actiontoprevent");
        actionToPreventInput= actionToPrevent.querySelector("textarea");
        (actionToPreventInput.value == "") ? actionToPrevent.classList.add("shake", "error") : checkField(actionToPreventInput,actionToPrevent);
        actionToPreventInput.onchange = () => { checkField(actionToPreventInput, actionToPrevent) }

        actionToPreventInput.oninput = () => { 
            actionToPreventInput.value = actionToPreventInput.value.replace(/^\s+/g, ''); // Remove leading spaces
        }
        
        actionToPreventInput.onchange = () => { 
            actionToPreventInput.value = actionToPreventInput.value.replace(/^\s+/g, ''); // Remove leading spaces
            checkField(actionToPreventInput, actionToPrevent);
        }

        if (actionToPreventInput.value.trim().length < 10 || actionToPreventInput.value.trim().length > 100) {
            actionToPrevent.classList.add("shake", "error");
            let errorTxt = actionToPrevent.querySelector(".error-txt");
            errorTxt.innerText = "Actions to prevent must be between 10 and 100 characters.";
        }

        remarks= form.querySelector(".remarks");
        remarksInput= remarks.querySelector("textarea");
        (remarksInput.value == "") ? remarks.classList.add("shake", "error") : checkField(remarksInput,remarks);
        remarksInput.onchange = () => { checkField(remarksInput, remarks) }

        remarksInput.oninput = () => { 
            remarksInput.value = remarksInput.value.replace(/^\s+/g, ''); // Remove leading spaces
        }
        
        remarksInput.onchange = () => { 
            remarksInput.value = remarksInput.value.replace(/^\s+/g, ''); // Remove leading spaces
            checkField(remarksInput, remarks);
        }
    }

    if(!bugSource.classList.contains("error")
    && !bugDesc.classList.contains("error") && !bugType.classList.contains("error")
    && !bugCategory.classList.contains("error")){

    let bugSource=bugSourceInput.value;
    let bugDescription=bugDescInput.value;
    let bugType=bugTypeInput.value;
    let bugCategory=bugCategoryInput.value;
    let rootCausee = rootCauseInput.value !== undefined ? rootCauseInput.value : "";
    let actionToPreventt = actionToPreventInput.value !== undefined ? actionToPreventInput.value:"";
    let remarkss = remarksInput.value !== undefined ? remarksInput.value : "";
    let assignedTo = assignedToInput.value !== undefined ? assignedToInput.value: "";
    let bugStatus=bugStatusInput.value !== undefined ? bugStatusInput.value:"";

    let bugsData=[bugSource,bugDescription,bugType,bugCategory,rootCausee,actionToPreventt,remarkss,assignedTo,bugStatus]

 //Check for root cause analysis fields.
 if (!rcaField1.classList.contains("hidden")){
 if(!rootCause.classList.contains("error") && !actionToPrevent.classList.contains("error") && !remarks.classList.contains("error")){
         submitBugsForm(bugsData);
 }
 }
 else{
     submitBugsForm(bugsData);
 }    
}
})

document.getElementById('resetBtn').addEventListener('click', function () {
 resetForm();
});


function resetForm() {
    window.location.href='./editBug';
}


document.querySelector('.fas.fa-arrow-left').addEventListener('click', function () {
    window.location.href = './projectBugsInfo';
});
