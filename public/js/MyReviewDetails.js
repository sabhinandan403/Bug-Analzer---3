/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let reviewPoint = {};
let reviewCategory = {};
let reviewStatus = {};
let commitIdAfter = {};
let commitIdBefore = {};
let developerComment = {};
document.addEventListener('DOMContentLoaded', async function () {
    if ($.fn.DataTable.isDataTable('#myReviewDetailTable')) {
        $('#myReviewDetailTable').DataTable().destroy()
    }
    const wrikeId = localStorage.getItem('wrikeId');
    const reviewType = localStorage.getItem('reviewType');

    document.getElementById('review-id').textContent = `Wrike-Id: ${wrikeId} ${reviewType} Details`
    const reviewDetailTable = $('#myReviewDetailTable').DataTable({
        columns: [
            { data: null },
            { data: 'review_point' },
            { data: 'review_date' },
            { data: 'status' },
            { data: 'developer_name' },
            { data: 'commit_id_before' },
            { data: 'commit_id_after' },
            { data: 'developer_comment' },
            {
                data: 'modified_at',
                render: function (data, type, row) {
                    return formatDate(data);
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return '<button class="btn-update-review" style="margin-right:5px;background-color:#12397b;color:white;border:white">Update</button>';

                }, width: '155px'
            }
        ],
        columnDefs: [{ targets: [0, 9], orderable: false },
        { targets: [0], searchable: false },],
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
        createdRow: function (row, data, dataIndex) {
            // Set srNo within the row
            $('td:eq(0)', row).html(dataIndex + 1);
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

    try {
        var reviewStatusResponse = await fetch('/review/getReviewStatus')
        if (!reviewStatusResponse) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error fetching review status data',
                showConfirmButton: true
            })
        } else {
            var reviewStatusResponseData = await reviewStatusResponse.json()
            populateReviewStatusDropdown(reviewStatusResponseData.data)
        }
    } catch (error) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'An error occurred while fetching review status!',
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

    function populateReviewStatusDropdown(data) {
        const reviewStatusDropdown = document.getElementById('newReviewStatus')
        // Clear existing options
        reviewStatusDropdown.innerHTML = ''

        // Populate options from the data
        data.forEach(item => {
            const option = document.createElement('option')
            option.textContent = item.status
            option.id = item.status
            option.value = item.status
            reviewStatusDropdown.appendChild(option)
        })
    }

    // let reviewPoint = {};
    // let reviewCategory = {};
    try {
        const response = await fetch(`/review/getMyReviewDetails/${wrikeId}/${reviewType}`);
        if (!response.ok) {
            reviewDetailTable.clear().rows.add([]).draw();
            throw new Error('Error fetching review details');
        }
        const reviewDetails = await response.json();
        // reviewDetails.data.forEach((item, index) => {
        //     item.srNo = index + 1;
        // });
        let formattedData = [];

        // Iterate over each row in the data
        reviewDetails.data.forEach(row => {
            // Extract review points array from the row object
            const reviewPoints = row.review_point;

            // Push review_point in reviewPoint object with review_date as key and review_point as value
            // Push review_category in reviewCategory object with review_date as key and review_category as value
            // Push review_point and review_category into respective objects with review_date as key
            const reviewDateKey = formatDate(row.review_date).split('  ')[1]; // Assuming formatDate function exists
            reviewPoint[reviewDateKey] = row.review_point;
            reviewCategory[reviewDateKey] = row.review_category;
            reviewStatus[reviewDateKey] = row.status;
            commitIdAfter[reviewDateKey] = row.commit_id_after
            commitIdBefore[reviewDateKey] = row.commit_id_before
            developerComment[reviewDateKey] = row.developer_comment
            // Get the length of the arrays
            const arrayLength = reviewPoints.length;


            // Iterate over each index
            for (let i = 0; i < arrayLength; i++) {
                // Create a new row object for each review point
                const formattedRow = {
                    review_point: reviewPoints[i],
                    review_date: formatDate(row.review_date),
                    status: Array.isArray(row.status) ? row.status[i].trim() : row.status, // Remove quotes and trim
                    developer_name: row.developer_name,
                    commit_id_before: Array.isArray(row.commit_id_before) ? row.commit_id_before[i].trim() : row.commit_id_before, // Remove quotes and trim
                    commit_id_after: Array.isArray(row.commit_id_after) ? row.commit_id_after[i].trim() : row.commit_id_after, // Remove quotes and trim
                    developer_comment: Array.isArray(row.developer_comment) ? row.developer_comment[i].trim() : row.developer_comment, // Remove quotes and trim
                    modified_at: row.modified_at
                };

                // Add the formatted row to the formatted data array
                formattedData.push(formattedRow);
            }
        });
        reviewDetailTable.clear().rows.add(formattedData).draw();
    } catch (error) {
        console.error(error);
        showError('Error fetching review details.');
    }



    $(document).mouseup(function (e) {
        var modal = $('.modal');
        // If the target of the click isn't the modal or a descendant of the modal
        if (!modal.is(e.target) && modal.has(e.target).length === 0) {
            // Close the modal
            modal.modal('hide');
        }
    });

    // Add event listener for update button if needed
    var updatePointDate
    $('#myReviewDetailTable').on('click', '.btn-update-review', function () {
        const row = reviewDetailTable.row($(this).parents('tr'));
        const rowData = row.data();
        updatePointDate = rowData.review_date.split('  ')[1]
        console.log(updatePointDate)
        $('#commitIdBefore').val(rowData.commit_id_before); // Prefill the modal field with current data
        $('#commitIdAfter').val(rowData.commit_id_after);
        $('#developerComment').val(rowData.developer_comment);
        $('#reviewPoint').val(rowData.review_point);
        $('#newReviewStatus').val(rowData.status);
        $('#editReviewPointModal').modal('show'); // Show the modal
    });

    document.getElementById('saveReviewPoint').addEventListener('click', async function () {
        const newStatusElement = document.getElementById('newReviewStatus');
        const newCommitIdBeforeElement = document.getElementById('commitIdBefore');
        const newCommitIdAfterElement = document.getElementById('commitIdAfter');
        const newDeveloperCommentElement = document.getElementById('developerComment');
    
        // Check if any required element is null
        if (!newStatusElement || !newCommitIdBeforeElement || !newCommitIdAfterElement || !newDeveloperCommentElement) {
            console.error('One or more required elements not found.');
            Swal.fire({
                icon:'warning',
                text: "Please fill all fields",
                title:'Warning',
                showConfirmButton:true,
            }).then((result)=>{
                if(result.confirm){
                    $('#editReviewPointModal').modal('hide');
                    Swal.close()
                }
            })
            return
            
        }
    
        const newStatus = newStatusElement.value;
        const newCommitIdBefore = newCommitIdBeforeElement.value;
        const newCommitIdAfter = newCommitIdAfterElement.value;
        const newDeveloperComment = newDeveloperCommentElement.value;
        const reviewPointToUpdate = document.getElementById('reviewPoint').value
        const row = reviewDetailTable.row(this.closest('tr'));
        const rowData = row.data();
        console.log('row data of the updated row :', rowData)
        const reviewDate = rowData.review_date.split('  ')[1];
        const reviewPoints = reviewPoint[reviewDate] // Extract review date from row data
        const updateIndex = reviewPoints.indexOf(reviewPointToUpdate)

        if(!newCommitIdBefore || !newCommitIdAfter || !newDeveloperComment){
            Swal.fire({
                icon:'warning',
                text: "Please fill all fields",
                title:'Warning',
                showConfirmButton:true,
            }).then((result)=>{
                if(result.confirm){
                    $('#editReviewPointModal').modal('hide');
                    Swal.close()
                }
            })
            return
        }

        if (updateIndex !== -1) {
            reviewStatus[reviewDate][updateIndex] = newStatus
            commitIdAfter[reviewDate][updateIndex] = newCommitIdAfter
            commitIdBefore[reviewDate][updateIndex] = newCommitIdBefore
            developerComment[reviewDate][updateIndex] = newDeveloperComment

            // Check if any of the arrays are empty or undefined
            if (
                reviewStatus.length === 0 ||
                commitIdAfter.length === 0 ||
                commitIdBefore.length === 0 ||
                developerComment.length === 0
            ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Please fill all fields before updating.',
                    showConfirmButton:true
                }).then((result)=>{
                    if(result.confirm){
                    Swal.close()
                    }
                });
                return; // Exit the function if validation fails
            }
            // Update the review point
            try {
                const putResponse = await fetch(`/review/updateDeveloperReviewPoint/${wrikeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        reviewStatus: reviewStatus[reviewDate],
                        commitIdBefore: commitIdBefore[reviewDate],
                        commitIdAfter: commitIdAfter[reviewDate],
                        reviewDate: reviewDate,
                        developerComment: developerComment[reviewDate]
                    })
                });
                if (putResponse.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Update Success',
                        text: 'Updated Successfully!'
                    }).then(() => {
                        location.reload(); // Reload the page
                    })

                } else {
                    Swal.fire({
                        icon: 'fail',
                        title: 'Update Failure',
                        text: 'Update Failed'
                    }).then(() => {
                        location.reload()
                    })
                    throw new Error('Error updating review point');
                }
            } catch (error) {
                console.error(error);
                showError('Error updating review point.');
                location.reload(); // Reload the page
            }

        }


    });

    function formatDate(timestamp) {
        if (timestamp === 'Not Updated') {
            return timestamp
        }
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

    //Function to logout
    document.querySelector(".logout-button").addEventListener("click", function () {
        var authorizationKey
        if (sessionStorage.getItem('userCategory') === 'Project Manager') {
            authorizationKey = 'pmAuthorization'
        } else if (sessionStorage.getItem('userCategory') === 'Team Lead') {
            authorizationKey = 'tlAuthorization'
        } else if (sessionStorage.getItem('userCategory') === 'Developer') {
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
