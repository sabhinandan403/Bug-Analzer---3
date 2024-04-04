/* eslint-disable no-undef */
const reviewCategories = []; // Array to store review categories corresponding to review points

document.addEventListener('DOMContentLoaded', async function () {

    var username = localStorage.getItem('username');
    var usertype = localStorage.getItem('usertype');

    if(usertype === 'project manager'){
        document.getElementById("myReview").style.display = 'none';
    }
    // Fetch review types
    try {
        const reviewTypesResponse = await fetch('/review/getReviewType');
        const reviewTypesData = await reviewTypesResponse.json();
        populateDropdown('reviewType', reviewTypesData.data, 'review_type', 'Select Review Type');
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while fetching review types!',
            showCancelButton: true,
            confirmButtonText: 'Try Again',
            cancelButtonText: 'Stay on this page'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to assignedBugs page
                window.location.reload();
            }
        });
        
    }

    // Fetch developers
    try {
        const developersResponse = await fetch(`/review/getDeveloperName/${username}/${usertype}`);
        const developersData = await developersResponse.json();
        populateDropdown('developerName', developersData.data, 'developer', 'Select Developer Name');
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while fetching developer data!',
            showCancelButton: true,
            confirmButtonText: 'Try Again',
            cancelButtonText: 'Stay on this page'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to assignedBugs page
                window.location.reload();
            }
        });
    }

    // Fetch review category
    try {
        const categoryResponse = await fetch(`/review/getReviewCategory`);
        const categoryData = await categoryResponse.json();
        populateDropdown('reviewCategory', categoryData.data, 'review_category', 'Select Review Category');
    } catch (error) {
        showError('Error fetching review category.');
    }

    // Fetch project name
    try {
        const projectResponse = await fetch(`/review/getProjectName/${username}/${usertype}`);
        const projectData = await projectResponse.json();
        populateDropdown('projectName', projectData.data, 'project', 'Select Project Name');
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while fetching project data!',
            showCancelButton: true,
            confirmButtonText: 'Try Again',
            cancelButtonText: 'Stay on this page'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to assignedBugs page
                window.location.reload();
            }
        });
    }

    // Call updatePlusButtonState initially to set button state
    updatePlusButtonState();

    const reviewPointTextarea = document.getElementById('reviewPoint');
    const additionalReviewPoints = document.querySelectorAll('.additional-review-point');

    // Add event listener to main review point textarea
    reviewPointTextarea.addEventListener('input', updatePlusButtonState);

    // Add event listener to each additional review point textarea
    additionalReviewPoints.forEach(textarea => {
        textarea.addEventListener('input', updatePlusButtonState);
    });

    // Add functionality to plus icon button
    const plusButton = document.querySelector('.btn-add-row');
    plusButton.addEventListener('click', function () {
        const reviewCategoryField = document.getElementById('reviewCategory').value;
        if (reviewCategoryField === '') {
            alert("Please select a review category.");
            return false;
        }
        
        reviewCategories.push(reviewCategoryField); // Store review category
        document.getElementById('reviewCategory').value = ''
        updatePlusButtonState(); // Update plus button state based on review point textarea
        const reviewPointDiv = document.querySelector('.col-md-12.field.review-point');
        const textarea = document.createElement('textarea');
        textarea.classList.add('form-control');
        textarea.classList.add('additional-review-point');
        textarea.placeholder = 'Additional Review Point';
        textarea.style.marginTop = '5px';
        textarea.style.marginBottom = '5px';
        textarea.rows = '1';
        reviewPointDiv.appendChild(textarea);

    });

    // Add functionality to reset button
    const resetButton = document.getElementById('resetBtn');
    resetButton.addEventListener('click', function () {
        // Clear the review-point field
        document.getElementById('reviewPoint').value = '';
        // Clear review categories array
        reviewCategories.length = 0;

        //Clear review status array
        reviewStatus.length = 0
        // Remove all additional review point fields
        const additionalReviewPoints = document.querySelectorAll('.additional-review-point');
        additionalReviewPoints.forEach(textarea => {
            textarea.remove();
        });
        // Update plus button state
        updatePlusButtonState();
    });

    // Add functionality to submit button
    const submitButton = document.getElementById('submitBtn');
    submitButton.addEventListener('click', async function () {
        // Get the main review point textarea value
        //const mainReviewPoint = document.getElementById('reviewPoint').value;

        // Get all review points including the main review point and additional review points
        const allReviewPoints = Array.from(document.querySelectorAll('.col-md-12.field.review-point textarea'))
            .map(textarea => textarea.value);

        // Combine the main review point and additional review points into a single array
        const allReviewPointsCombined = [...allReviewPoints];
        // Combine review points with their corresponding categories
        const reviewCategoryField = document.getElementById('reviewCategory').value;
        reviewCategories.push(reviewCategoryField); // Store review category
        
        
        const formData = {
            reviewerName: username,
            team: localStorage.getItem('team'),
            projectName: document.getElementById('projectName').value,
            taskName: document.getElementById('taskName').value,
            reviewType: document.getElementById('reviewType').value,
            developerName: document.getElementById('developerName').value,
            reviewPoints: allReviewPointsCombined,
            reviewCategories: reviewCategories, // Include review categories in form data
            wrikeId: document.getElementById('wrikeId').value,

        };

        var wrikeID = document.getElementById('wrikeId').value;
        var taskName = document.getElementById('taskName').value;

        const testWrikeId = /^\d+$/.test(wrikeID);
        const testTaskName = /^[A-Za-z]+$/.test(taskName);
        if(!testWrikeId || !testTaskName){
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Please fill all fields with valid data',
                showCancelButton: true,
                confirmButtonText: 'ok',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect to assignedBugs page
                    Swal.close()
                }
            });
            return false;
        }

        if (reviewCategories.length !== allReviewPointsCombined.length) {
            
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Please select review category',
                showCancelButton: true,
                confirmButtonText: 'ok',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect to assignedBugs page
                    Swal.close()
                }
            });
            return false
        }

        // Check if any property is undefined
        for (const key in formData) {
            if (Object.prototype.hasOwnProperty.call(formData, key) && formData[key] === undefined) {
                //alert('Please fill all fields with valid data')
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: 'Please fill all fields with valid data',
                    showCancelButton: true,
                    confirmButtonText: 'ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect to assignedBugs page
                        window.location.reload()
                        Swal.close()
                    }
                });
                return false; // Return false if any property is undefined
            }
        }


        try {
            const response = await fetch('/review/addReviewPoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Review points added successfully',
                    showConfirmButton: true
                }).then(() => {
                    location.reload();
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error adding the review points.',
                    showConfirmButton: true

                }).then(() => {
                    console.log("Failed to add review points");
                    location.reload();
                })

            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: "Error",
                text: 'Internal Server Error',
                showConfirmButton: true
            }).then(() => {
                console.log('Insert failed');
                location.reload();
            })
            // showError('Error submitting form.');
        }
    });

    // Function to populate dropdown
    function populateDropdown(id, data, key, placeholder) {
        const select = document.getElementById(id);
        select.innerHTML = '';

        // Create a placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = placeholder;
        select.appendChild(placeholderOption);

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[key];
            option.textContent = item[key];
            select.appendChild(option);
        });
    }


    // Function to show error message
    function showError(message) {

        // eslint-disable-next-line no-undef
        Swal.fire({
            icon: 'error',
            text: message
        });
    }

    // Function to update plus button state based on review point textarea
    function updatePlusButtonState() {
        const plusButton = document.querySelector('.btn-add-row');
        const reviewPointTextarea = document.getElementById('reviewPoint');
        const additionalReviewPoints = document.querySelectorAll('.additional-review-point');
        const isReviewPointEmpty = reviewPointTextarea.value.trim() === '';

        // Check if any of the review point textarea fields or the main review point is empty
        const isEmpty = isReviewPointEmpty || [...additionalReviewPoints].some(textarea => textarea.value.trim() === '');

        plusButton.disabled = isEmpty;
    }

    //Function to show swal message.
    document.querySelector(".logout-button").addEventListener("click", function () {
        var authorizationKey
        if(sessionStorage.getItem('userCategory') === 'Project Manager'){
            authorizationKey = 'pmAuthorization'
        }else if(sessionStorage.getItem('userCategory') === 'Team Lead'){
            authorizationKey = 'tlAuthorization'
        }else if(sessionStorage.getItem('userCategory') === 'Developer'){
            authorizationKey = 'devAuthorization'
        }
        Swal.fire({
            title: "Are you sure you want to log out?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                window.sessionStorage.removeItem(authorizationKey);
                window.location.href = "../userLogin";
            }
        });
    });
});


