



//Function to show toast messages on web application.

function showToast(message, backgroundColor) {
    Toastify({
      text: message,
      duration: 2500,
      gravity: "bottom",
      position: "right",
      backgroundColor: backgroundColor,
    }).showToast();
    
    setTimeout(function () {
      window.location.reload();
    }, 2500);
}


//To logout user from the web application.

document.querySelector(".logout-button").addEventListener("click", function () {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to logout route or perform logout action
      window.sessionStorage.removeItem("pmAuthorization");
      window.sessionStorage.removeItem("tlAuthorization");
      window.sessionStorage.removeItem("tesAuthorization");
      window.sessionStorage.removeItem("userCategory");
      window.location.href = "../userLogin";
      }
    });
});
