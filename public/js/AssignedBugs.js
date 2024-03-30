/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 30, 2024
 *
 * Module: JS file
 * Description
 * -----------------------------------------------------------------------------------
 * This file defines javascript functions that will be used to see assigned bugs to developer in application.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 30, 2024        Initially Created
 *
 * -----------------------------------------------------------------------------------
 */

if (!window.sessionStorage.getItem("devAuthorization")) {
    window.location.href = '../userLogin';
}

document.addEventListener("DOMContentLoaded", async function () {
    
    localStorage.removeItem("specificBugData")
    localStorage.removeItem('responseData');
    
    let userToken = window.sessionStorage.getItem("devAuthorization");


    let response = await fetch("/user/assignedBugs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userToken })
    });

    let responseData = await response.json();

    if(response.ok){

    let dataSet = [];

    for (let i = 0; i < responseData.data.length; i++) {
        let obj = responseData.data[i];
    
          let valuesArray = [];
      
         valuesArray.push(obj["id"]);
         valuesArray.push(obj["bug_source"]);
         valuesArray.push(obj["bug_description"]);
         valuesArray.push(obj["bug_type"]);
         valuesArray.push(obj["bug_category"]);
         valuesArray.push(obj["root_cause"]);
         valuesArray.push(obj["action_to_prevent"]);
         valuesArray.push(obj["remarks"]);
      
         let datePortion = obj["created_at"].substring(0, 10);
         valuesArray.push(datePortion);
         
         datePortion = obj["updated_at"].substring(0, 10);
         valuesArray.push(datePortion);
    
         valuesArray.push(obj["bug_status"]);
         valuesArray.push(obj["assigned_to"]);
      
          dataSet.push(valuesArray);
        }

    let originalStatus = ''; // Store the original status

    function setOriginalValues() {
        let statusDropdown = document.querySelector('.status-dropdown');
        originalStatus = statusDropdown ? statusDropdown.value : '';
    }

    // Call the function to set initial values
    setOriginalValues();

    let projectStatus = ['STACK', 'ON HOLD', 'STUCK', 'CLOSED'];
    let dataTable = new DataTable("#example", {
        columns: [
            { title: "BugId" },
            { title: "Source" },
            { title: "Description" },
            { title: "Type" },
            { title: "Category" },
            { title: "Root Cause" },
            { title: "Preventive Action" },
            { title: "Remarks" },
            { title: "Created" },
            { title: "Updated" },
            { title: "Status" },
            { title: "Change"},
            { title: "Save" },
        ],
        data: dataSet,
        columnDefs: [
            {
                targets: 11,
                render: function (data, type, row) {
                    let bugId = row[0];
                    
                    // Filter out the current status from the projectStatus array
                    let availableStatus = projectStatus.filter(status => status !== row[9]);
    
                    let statusDropdownHTML = `
                        <select class="status-dropdown" data-bug-id="${bugId}">
                            <option value="" disabled selected>Select Status</option>
                            ${availableStatus.map(status => `<option value="${status}">${status}</option>`).join('')}
                        </select>
                    `;
                    return statusDropdownHTML;
                }
            },
            {
                targets: 12, // Index for the new column
                render: function (data, type, row) {
                    let bugId = row[0];
                    let saveButtonHTML = `
                        <button class="save-button" onclick="saveBugStatus(this)" data-bug-id="${bugId}">
                            Save
                        </button>
                    `;
                    return saveButtonHTML;
                }
            }
        ],
        language: {
            paginate: {
              first: '<a href="#" class="paginate-button" aria-label="First"><i class="fas fa-backward custom-icon"></i></a>',
              previous: '<a href="#" class="paginate-button" aria-label="Previous"><i class="fas fa-backward custom-icon"></i></a>',
              next: '<a href="#" class="paginate-button" aria-label="Next"><i class="fas fa-forward custom-icon"></i></a>',
              last: '<a href="#" class="paginate-button" aria-label="Last"><i class="fas fa-forward custom-icon"></i></a>',
            },
          },
    });

  document.getElementById('export-button').addEventListener('click', function () {
    exportToExcel(responseData.data);
  });

  function exportToExcel(responseData) {
    /* Convert data to workbook */
    var ws = XLSX.utils.json_to_sheet(responseData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* Convert workbook to binary string */
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    /* Create a blob from the binary string */
    var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    /* Save the blob as a file */
    saveAs(blob, 'exported_data.xlsx');
}

// Utility function to convert string to ArrayBuffer
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}


   }
   else{
    document.getElementById('export-button').style.display = 'none';
    
    Toastify({
        text: "No bug data found",
        duration: 2500,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#B31312",
    }).showToast();
   }
});


async function saveBugStatus(button) {
    let bugId = button.getAttribute('data-bug-id');
    let statusDropdown = document.querySelector(`.status-dropdown[data-bug-id="${bugId}"]`);
    
    if (statusDropdown) {
        let selectedStatus = statusDropdown.value;
        if (!selectedStatus) {

            Toastify({
                text: "Please select a status before saving.",
                duration: 2500,
                gravity: "bottom",
                position: "right",
                backgroundColor: "#B31312",
            }).showToast();
        } 
    
    else{
    let bugStatus = statusDropdown.value;
    
    let result = await fetch('bugs/editBug', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bugId, bugStatus })
    });

    let responseData = await result.json();

    Toastify({
        text: responseData.message,
        duration: 2500,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#65B741",
    }).showToast();

    setTimeout(function () {
        window.location.reload();
    }, 2500);
}
}
}

document.querySelector('.logout-button').addEventListener("click", function() {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        window.sessionStorage.removeItem("devAuthorization");
        window.sessionStorage.removeItem("userCategory");
        window.location.href = "../userLogin";
      }
    });
  });
