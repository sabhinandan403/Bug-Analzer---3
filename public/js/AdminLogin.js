/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 30, 2024
 *
 * Module: JS file
 * Description
 * -----------------------------------------------------------------------------------
 * This file defines javascript functions that will be used to login admin in application.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 30, 2024        Initially Created
 *
 * -----------------------------------------------------------------------------------
 */

//If admin is already logged in, then redirect to add user page.

if(window.sessionStorage.getItem("authorization")){
    window.location.href = "../addUser";
}

//Generic function to show toast messages.
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


    document.getElementById("loginForm").addEventListener("submit", async function (event) {

        event.preventDefault();

        let form = document.querySelector("form");
        let pField = form.querySelector(".password");
        let pInput = pField.querySelector("input");
        let uField = form.querySelector(".username");
        let uInput = uField.querySelector("input");

        //if email and password is blank then add shake class in it else call specified function

        (pInput.value == "") ? pField.classList.add("shake", "error") : checkPass();
        (uInput.value == "") ? uField.classList.add("shake", "error") : checkUserName();

        setTimeout(() => { //remove shake class after 500ms
            pField.classList.remove("shake");
            uField.classList.remove("shake");
        }, 500);


        pInput.onkeyup = () => { checkPass(); } 
        uInput.onkeyup = () => { checkUserName(); }


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

        function checkUserName() {
            var uInputValue = uInput.value.trim(); // Trim to remove leading and trailing spaces
            let errorTxt = uField.querySelector(".error-txt");
            if (uInputValue === "") {
                // If username is empty, add error and remove valid class
                uField.classList.add("error");
                uField.classList.remove("valid");
                errorTxt.innerText = "Username can't be empty"
            } else if (!/^[a-zA-Z]+$/.test(uInputValue)) {
                // If username contains non-alphabetic characters, add error and remove valid class
                uField.classList.add("error");
                uField.classList.remove("valid");
                errorTxt.innerText = "Username must contain only alphabets."
            } else {
                // If username is valid, remove error and add valid class
                uField.classList.remove("error");
                uField.classList.add("valid");
            }
        }

        //if eField and pField doesn't contain the error class that means the user filled in the details properly
        if (!pField.classList.contains("error") && !uField.classList.contains("error")) {
            try {
                let username = uInput.value;
                let password = pInput.value;

                let response = await fetch("/user/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password })
                });

                let responseData = await response.json();

                if(responseData.success){
                    window.sessionStorage.setItem("authorization", response.headers.get("authorization"));
                    showToast(responseData.success, responseData.message);

                    setTimeout(function () {
                        window.location.href = "/addUser";
                      }, 2500);
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

