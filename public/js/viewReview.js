/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', async function () {
    if ($.fn.DataTable.isDataTable('#reviewTable')) {
        $('#reviewTable').DataTable().destroy()
    }
    // Get the username
    const username = localStorage.getItem('username');

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

    // Fetch review data
    try {
        const response = await fetch(`/review/getReviewPoints/${username}`);
        if (response.ok) {
            const reviewData = await response.json();
            populateDataTable(reviewData.data);
        } else{
            populateDataTable([])
        }
    } catch (error) {
        showError('Error fetching review data.');
    }


    function populateDataTable(data) {
        const table = $('#reviewTable').DataTable({
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
                    },
                },
                { data: 'review_type' },
                { data: 'review_status' },
                { data: 'developer_name' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return '<button class="btn-view-review" style="margin-right:5px;width:68px;background-color:#12397b;color:white;border:white;">View</button>' +
                            '<button class="btn-remove-review"style="background-color:#12397b;color:white;border:white">Remove</button>';
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
                const api = this.api()
                const recordsTotal = api.page.info().recordsTotal
                const pageLength = api.page.len()

                if (recordsTotal <= pageLength) {
                    // If the total records is less than or equal to the page length,
                    // hide the pagination
                    $('.paging_full_numbers').hide()
                } else {
                    // Otherwise, show the pagination
                    $('.paging_full_numbers').show()
                }
            }
        });

        // Add event listeners for buttons
        $('#reviewTable').on('click', '.btn-remove-review', async function () {
            const wrikeId = table.row($(this).closest('tr')).data().wrike_id;
            try {
                const response = await fetch(`/review/deleteReview/${wrikeId}`, { method: 'DELETE' });
                if (response.ok) {
                    showSuccess('Review removed successfully.');
                    location.reload();
                } else {
                    showError('Error removing review.');
                    location.reload();
                }
            } catch (error) {
                showError('Error removing review.');
                location.reload();
            }
        });

        $('#reviewTable').on('click', '.btn-view-review', function () {
            const wrikeId = table.row($(this).closest('tr')).data().wrike_id;
            const reviewType = table.row($(this).closest('tr')).data().review_type;
            localStorage.setItem('wrikeId', wrikeId);
            localStorage.setItem('reviewType', reviewType);
            window.location.href = `reviewDetail`;
        });
    }

    function showSuccess(message) {
        Swal.fire({
            icon: 'success',
            text: message
        });
    }

    function showError(message) {
        Swal.fire({
            icon: 'error',
            text: message
        });
    }
    //Function to logout.
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
