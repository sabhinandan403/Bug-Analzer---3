/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let reviewPoint = {};
let reviewCategory = {};
document.addEventListener('DOMContentLoaded', async function () {
    if ($.fn.DataTable.isDataTable('#reviewDetailTable')) {
        $('#reviewDetailTable').DataTable().destroy()
    }
    const wrikeId = localStorage.getItem('wrikeId');
    const reviewType = localStorage.getItem('reviewType');
    document.getElementById('review-id').textContent = `Wrike-Id: ${wrikeId} ${reviewType} Details`
    const reviewDetailTable = $('#reviewDetailTable').DataTable({
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
                    return '<button class="btn-update-review" style="margin-right:5px;background-color:#12397b;color:white;border:white;width:63px">Update</button>' +
                        '<button class="btn-remove-review" style="background-color:#12397b;color:white;border:white;width:63px">Remove</button>';
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
        const response = await fetch(`/review/getReviewDetails/${wrikeId}/${reviewType}`);
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

    $('#reviewDetailTable').on('click', '.btn-remove-review', async function () {
        const row = reviewDetailTable.row($(this).parents('tr'));
        const rowData = row.data();
        //const remainingRows = reviewDetailTable.rows().data().toArray().filter(item => item.srNo !== rowData.srNo);
        var reviewDate = rowData.review_date.split('  ')[1]
        // Collect review points and review categories of remaining rows
        //const remainingReviewPoints = remainingRows.map(item => item.reviewPoint);
        //const remainingReviewCategories = remainingRows.map(item => item.reviewCategory);

        const reviewPoints = reviewPoint[reviewDate];
        const reviewCategories = reviewCategory[reviewDate];

        // Find the index of the review point to remove
        const removeIndex = reviewPoints.indexOf(rowData.review_point);
        if (removeIndex !== -1) {
            // Remove the review point from the array
            reviewPoints.splice(removeIndex, 1);

            // Remove the corresponding review category
            reviewCategories.splice(removeIndex, 1);
            try {
                const putResponse = await fetch(`/review/removeReviewPoint/${wrikeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        reviewPoints: reviewPoints,
                        reviewCategories: reviewCategories,
                        reviewDate: reviewDate
                    })
                });

                if (!putResponse.ok) {
                    throw new Error('Error removing review point');
                }
                Swal.fire({
                    icon:'success',
                    title:'Success',
                    text:'Review point successfully removed',
                    showConfirmButton:true
                }).then((result)=>{
                    if(result.confirm){
                        location.reload();
                    }
                })
                
            } catch (error) {
                console.error(error);
                showError('Error removing review point.');
                location.reload(); // Reload the page
            }
        }
    });


    $(document).mouseup(function (e) {
        var modal = $('.modal');
        // If the target of the click isn't the modal or a descendant of the modal
        if (!modal.is(e.target) && modal.has(e.target).length === 0) {
            // Close the modal
            modal.modal('hide');
        }
    });

    // Add event listener for update button if needed
    var updateRowDate;
    var updateReviewPoint;
    $('#reviewDetailTable').on('click', '.btn-update-review', function () {
        const row = reviewDetailTable.row($(this).parents('tr'));
        const rowData = row.data();
        updateRowDate = rowData.review_date
        updateReviewPoint = rowData.review_point
        $('#reviewPoint').val(updateReviewPoint); // Prefill the modal field with current data
        $('#editReviewPointModal').modal('show'); // Show the modal
    });

    document.getElementById('saveReviewPoint').addEventListener('click', async function () {
        const newReviewPoint = document.getElementById('reviewPoint').value; // Get the updated review point
        // const row = reviewDetailTable.row(this.closest('tr'));
        // const rowData = row.data();
        const reviewDate = updateRowDate.split('  ')[1]; // Extract review date from row data
        const reviewPoints = reviewPoint[reviewDate]; // Get the review points array for the date
        const reviewCategories = reviewCategory[reviewDate]; // Get the review categories array for the date
        const updateIndex = reviewPoints.indexOf(updateReviewPoint); // Find the index of the review point to update
        if (updateIndex !== -1) {
            reviewPoints[updateIndex] = newReviewPoint; // Update the review point
            try {
                const putResponse = await fetch(`/review/updateReviewPoint/${wrikeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        reviewPoints: reviewPoints,
                        reviewCategories: reviewCategories,
                        reviewDate: reviewDate
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
