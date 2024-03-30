/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
 *
 * Module: JS file
 * Description
 * -----------------------------------------------------------------------------------
 * This file defines javascript functions that will be used to generate data of project spefific bugs in webpage.
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By       Modified On         Description
 * Yash Pathak       Jan 19, 2024        Initially Created
 * Yash Pathak       Jan 21, 2024        Added support for datatable.
 * Yash Pathak       Jan 22, 2024        Added support for toast messages.
 *
 * -----------------------------------------------------------------------------------
 */

if (!localStorage.getItem('responseData') || (!window.sessionStorage.getItem("pmAuthorization") 
&& !window.sessionStorage.getItem("tlAuthorization") && !window.sessionStorage.getItem("tesAuthorization"))){
   window.location.href = "../userLogin";
}

document.addEventListener("DOMContentLoaded",async function () {

  document.getElementById('export-button').addEventListener('click', function () {
    exportToExcel(responseData.data);
  });

  function exportToExcel(responseData) {
 
          const bugData = responseData.map(item => {
            return {
              "Bug ID": item.bug_id,
              "Project Name": item.bug_data.project_name,
              "Bug Source": item.bug_data.bug_source,
              "Bug Description": item.bug_data.bug_description,
              "Type of Issue": item.bug_data.type_of_issue,
              "Bug Category": item.bug_data.bug_category,
              "Root Cause": item.bug_data.root_cause,
              "Action To Prevent": item.bug_data.action_to_prevent,
              "Remarks": item.bug_data.remarks,
              "Bug Status": item.bug_data.bug_status,
              "Created At": item.created_at,
              "Updated At": item.updated_at,
              "Created By": item.bug_data.created_by,
              "Assigned To": item.bug_data.assigned_to,
              "Developer Comment": item.bug_data.developer_comment
            };
  });


    /* Convert data to workbook */
    var ws = XLSX.utils.json_to_sheet(bugData);

    // Calculate column widths based on content
    var columnWidths = [];
    for (var R = 0; R < ws['!ref'].split(':')[1].replace(/\D/g, ''); ++R) {
        for (var C = 0; C < ws['!ref'].split(':')[1].replace(/\d/g, '').charCodeAt(0) - 65; ++C) {
            var cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            var cellValue = ws[cellAddress] ? ws[cellAddress].v : '';
            var cellTextLength = (cellValue + '').length;

            columnWidths[C] = columnWidths[C] || 0;
            columnWidths[C] = Math.max(columnWidths[C], cellTextLength);
        }
    }

    // Apply column widths to the worksheet
    ws['!cols'] = [];
    columnWidths.forEach(function (width, index) {
        ws['!cols'][index] = { width: width + 2 }; // Adding some padding
    });

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* Convert workbook to binary string */
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    /* Create a blob from the binary string */
    var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    /* Get the current date */
    var currentDate = new Date().toISOString().slice(0, 10);

    /* Save the blob as a file with project name and date */
    saveAs(blob, `${projectName}_BugsReport_${currentDate}.xlsx`);
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


  let projectName=JSON.parse(localStorage.getItem('responseData'));

  let response = await fetch("/bugs/projectBugsData", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body:JSON.stringify({ projectName})
  });

  let responseData = await response.json();

  console.log(responseData.data);

  if (response.ok) {

    document.querySelector("h1").textContent = `${projectName} Bugs Report`;
   
    let dataSet=[];
    let bugsData= responseData.data
    
     for (let i = 0; i < bugsData.length; i++) {
      let obj = responseData.data[i].bug_data;

      let valuesArray = [];
  
     valuesArray.push( responseData.data[i].bug_id);
     valuesArray.push(obj["bug_source"]);
     valuesArray.push(obj["bug_description"]);
     valuesArray.push(obj["type_of_issue"]);
     valuesArray.push(obj["bug_category"]);
     
     valuesArray.push(obj["bug_status"]);
     valuesArray.push(obj["assigned_to"]);
  
     let created_at = responseData.data[i].created_at.substring(0, 10);
     valuesArray.push(created_at);
     
     let updated_at = responseData.data[i].updated_at.substring(0, 10);
     valuesArray.push(updated_at);

     valuesArray.push(obj["root_cause"]);
     valuesArray.push(obj["action_to_prevent"]);
     valuesArray.push(obj["remarks"]);

     valuesArray.push(obj["created_by"]);
     valuesArray.push(obj["developer_comment"]);

     dataSet.push(valuesArray);
    }
    console.log(dataSet);
  

  localStorage.removeItem("specificBugData")

  let dataTable = new DataTable("#example", {
    paging: true, // Enable pagination
    pageLength: 5, // Set the number of entries per page to 5
    columns: [
      { title: "BugID"},
      { title: "Source" },
      { title: "Description" },
      { title: "Type Of Issue" },
      { title: "Category" },
      { title: "Status" },
      { title: "Assigned" },
      { title: "Created" },
      { title: "Updated" },
      { title: "Change" },
    ],
    data: dataSet,
    columnDefs: [
      {
        targets: 9,
        render: function (data, type, row) {
          return (
            '<button class="details-button" data-project="' +
            row[0] +
            '"> <i class="fas fa-edit"></i> </button>'
          );
        },
      },
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

  $("#example").on("click", ".details-button", async function () {
    let rowData = dataTable.row($(this).parents("tr")).data();

    // Store the specific bug data in localStorage
  
    localStorage.setItem(
      "specificBugData",
      JSON.stringify({rowData,projectName})
    );

    // Redirect to the editBugStatus page
    window.location.href = "./editBug";
  });

  Toastify({
    text: responseData.message,
    duration: 2500,
    gravity: "bottom",
    position: "right",
    backgroundColor: "#65B741",
  }).showToast();
}

else{
  showToast(responseData.message, "#B31312");

  setTimeout(function () {
    window.location.href="./projectBugsInfo";
}, 2500);
}

});
