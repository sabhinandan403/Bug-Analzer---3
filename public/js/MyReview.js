/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
document.addEventListener("DOMContentLoaded", async function () {
    var username = localStorage.getItem('username')
    var usertype = localStorage.getItem('usertype')

    const formatDate = (timestamp) => {
        if (timestamp === null || timestamp === undefined || timestamp === '') {
            return ''; // Return empty string
        }

        // Parse the timestamp into a Date object
        const date = new Date(timestamp);


        // Extract year, month, day, hours, minutes, and seconds from the adjusted date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Return the formatted date string
        return `${day}/${month}/${year}  ${hours}:${minutes}:${seconds}`;
    };

    try {
        const response = await fetch(`/review/GetMyReview/${username}/${usertype}`);
        if (response.ok) {
            const reviewData = await response.json();
            populateMyReviewTable(reviewData.data);
        } else {
            // If there's an error fetching review data, populate the table with an empty array
            populateMyReviewTable([]);
            // Show a confirmation button
            showConfirmationButton();
        }
    } catch (error) {
        showConfirmationButton();
        throw error
        // Show a confirmation button
       
    }


    // Function to populate the DataTable with review data
    function populateMyReviewTable(data) {
        const table = $('#myReviewTable').DataTable({
            data: data,
            columns: [
                { data: 'wrike_id' },
                { data: 'task_name' },
                { data: 'reviewer_name' },
                {
                    data: 'review_date',
                    render: function (data, type, row) {
                        // Call formatDate function to format the date
                        return formatDate(data)
                    }
                },
                { data: 'review_type' },
                { data: 'review_status' },
                { data: 'developer_name' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<button class="btn-view-review" style="margin-right:5px;width:68px;background-color:#12397b;color:white;border:white;">View</button>';
                    }
                }
            ],
            columnDefs: [{ targets: [7], orderable: false }],
            lengthMenu: [10, 15, 20],
            pageLength: 10,
            language: {
                paginate: {
                    next: '<i class="fa-solid fa-forward-step"></i>',
                    previous: '<i class="fa-solid fa-backward-step"></i>',
                    first: '<i class="fa-solid fa-angle-double-left"></i>',
                    last: '<i class="fa-solid fa-angle-double-right"></i>'
                }
            },
            drawCallback: function (settings) {
                const api = this.api();
                const recordsTotal = api.page.info().recordsTotal;
                const pageLength = api.page.len();

                if (recordsTotal <= pageLength) {
                    // If the total records is less than or equal to the page length,
                    // hide the pagination
                    $('.paging_full_numbers').hide();
                } else {
                    // Otherwise, show the pagination
                    $('.paging_full_numbers').show();
                }
            }
        });
    }

    // Function to show a confirmation button
    function showConfirmationButton() {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while fetching review data!',
            showCancelButton: true,
            confirmButtonText: 'Go to Assigned Bugs',
            cancelButtonText: 'Stay on this page'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to assignedBugs page
                window.location.href = './assignedBugs';
            }
        });
    }

    // Add event listener for the "View" button
    $('#myReviewTable').on('click', '.btn-view-review', function () {
        const data = $('#myReviewTable').DataTable().row($(this).closest('tr')).data();
        const wrikeId = data.wrike_id;
        const reviewType = data.review_type;
        localStorage.setItem('wrike_id', wrikeId);
        localStorage.setItem('review_type', reviewType);
        // Redirect to myReviewPointDetail page with the Wrike ID
        window.location.href = `./myReviewDetails`;
    });

    //Function to logout
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
