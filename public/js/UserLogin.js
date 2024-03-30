/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 30, 2024
 *
 * Module: JS file
 * Description
 * -----------------------------------------------------------------------------------
 * This file defines javascript functions that will be used to login user in application.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 30, 2024        Initially Created
 *
 * -----------------------------------------------------------------------------------
 */

localStorage.removeItem("specificBugData")
localStorage.removeItem('responseData');

if(window.sessionStorage.getItem("pmAuthorization") || window.sessionStorage.getItem("tlAuthorization")
||  window.sessionStorage.getItem("tesAuthorization")){
   window.location.href = "../addBug";
}

if(window.sessionStorage.getItem("devAuthorization")){
    window.location.href = "../assignedBugs";
}

function showToast(success, message) {
    Toastify({
        text: message,
        duration: 1500,
        gravity: "bottom",
        position: "right",
        backgroundColor: success ? "#65B741" : "#B31312",
    }).showToast();
}

document.addEventListener('DOMContentLoaded', async function () {

    let form = document.querySelector("form");

    let categoryField=form.querySelector('.employeecategory');
    let categoryInput=categoryField.querySelector("select");

    let uField = form.querySelector(".username");
    let uInput = uField.querySelector("input");

    let pField = form.querySelector(".password");
    let pInput = pField.querySelector("input");

    categoryInput.addEventListener("change", function () {
        categoryInput.style.color = 'black';
        pInput.value = "";
        uInput.value = "";

        pField.classList.remove("shake");
        uField.classList.remove("shake");
        pField.classList.remove("error");
        uField.classList.remove("error");
    })

    document.getElementById("userLoginForm").addEventListener("submit", async function (event) {

        event.preventDefault();

        (pInput.value == "") ? pField.classList.add("shake", "error") : checkPass();
        (uInput.value == "") ? uField.classList.add("shake", "error") : checkUserId();
        (categoryInput.value== "") ? categoryField.classList.add("shake", "error") : checkEmptyField(categoryField,categoryInput);

        setTimeout(() => {
            pField.classList.remove("shake");
            uField.classList.remove("shake");
            categoryField.classList.remove("shake");
        }, 500);

        

        pInput.onkeyup = () => { checkPass(); }
        uInput.onkeyup = () => { checkUserId(); }
        categoryInput.onchange = () =>{
            categoryInput.style.color = 'black';
            checkEmptyField(categoryField,categoryInput);
        }

        
        function checkPass() {
                let passwordInput=pInput.value.trim()
                if (passwordInput == "") {
                    pField.classList.add("error");
                    pField.classList.remove("valid");
                    let errorTxt = pField.querySelector(".error-txt");
    
                    errorTxt.innerText = "Password can't be empty";
                } else {
                    pField.classList.remove("error");
                    pField.classList.add("valid");
                }
        }

        function checkEmptyField(field, input) {
            if (input.value === "" && !input.disabled) {
                field.classList.add("shake", "error");
                let errorTxt = field.querySelector(".error-txt");
                errorTxt.innerText = `Emplpoyee Category can't be empty`;
             } else {
                field.classList.remove("shake", "error");
                field.classList.add("valid");
             }
        }

        function checkUserId() {
            var uInputValue = uInput.value.trim(); // Trim to remove leading and trailing spaces
            let errorTxt = uField.querySelector(".error-txt");
            if (uInputValue === "") {
                // If user id is empty, add error and remove valid class
                uField.classList.add("error");
                uField.classList.remove("valid");
                errorTxt.innerText = "User Id can't be empty"
            } else {
                // If user id is valid, remove error and add valid class
                uField.classList.remove("error");
                uField.classList.add("valid");
            }
        }

        //if eField and pField doesn't contain the error class that means the user filled in the details properly
        if (!pField.classList.contains("error") && !uField.classList.contains("error") && !categoryField.classList.contains("error")) {
            try {
    
                let userid=uInput.value;
                let password = pInput.value;
                let category = categoryInput.value;

                let response = await fetch("/user/userLogin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userid, password, category})
                });

                let responseData = await response.json();
                if(responseData.success){

                    if(category == "Project Manager") window.sessionStorage.setItem("pmAuthorization", response.headers.get("authorization"));
                    else if(category == "Team Lead") window.sessionStorage.setItem("tlAuthorization", response.headers.get("authorization"));
                    else if( category == "Developer") window.sessionStorage.setItem("devAuthorization", response.headers.get("authorization"));
                    else window.sessionStorage.setItem("tesAuthorization", response.headers.get("authorization"));
                    
                    window.sessionStorage.setItem("userCategory", category);

                    showToast(responseData.success, responseData.message);

                    if(category == "Team Lead" || category == "Project Manager" || category == "Tester"){
                        setTimeout(function () {
                            window.location.href = "/addBug";
                          }, 2500);
                    } 
                    else{
                        setTimeout(function () {
                            window.location.href = "/assignedBugs";
                        }, 2500);
                    }
                }
                else{
                    showToast(responseData.success, responseData.message);
                    
                    setTimeout(function () {
                        window.location.reload();
                    }, 2500);
                }

            } catch (error) {
                showToast(false,error.message);
                
                setTimeout(function () {
                    window.location.reload();
                }, 2500);
            }
        }
    })
})