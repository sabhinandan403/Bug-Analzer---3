/**
 * Project Name: Bug Analyzer
 * @project Bug Analyzer
 * @author Yash Pathak
 * @date Jan 19, 2024
 *
 * Module: JS file
 * Description
 * -----------------------------------------------------------------------------------
 * This file defines javascript functions that will be used to generate data of all bugs in webpage.
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

if (
  !window.sessionStorage.getItem("pmAuthorization") &&
  !window.sessionStorage.getItem("tlAuthorization") &&
  !window.sessionStorage.getItem("tesAuthorization")
) {
  window.location.href = "../userLogin";
}

document.addEventListener("DOMContentLoaded", async function () {
  localStorage.removeItem("specificBugData");
  localStorage.removeItem("responseData");

  let authorizationToken =
    window.sessionStorage.getItem("pmAuthorization") ||
    window.sessionStorage.getItem("tlAuthorization") ||
    window.sessionStorage.getItem("tesAuthorization");

  //Function to show toast messages to the user.
  function showToast(message, backgroundColor) {
    Toastify({
      text: message,
      duration: 2500,
      gravity: "bottom",
      position: "right",
      backgroundColor: backgroundColor,
    }).showToast();
  }

  let userCategory = window.sessionStorage.getItem("userCategory");

  let response = await fetch("/bugs/allBugsData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ authorizationToken, userCategory }),
  });

  let responseData = await response.json();

  if (response.ok) {
    let dataSet = [];

    for (let i = 0; i < responseData.data.length; i++) {
      let obj = responseData.data[i];
      let valuesArray = [];

      if (obj.project_name !== null) {
        for (let key in obj) {
          if (obj.hasOwnProperty(key) && key != "team") {
            valuesArray.push(obj[key]);
          }
        }
        dataSet.push(valuesArray);
      }
    }

    //Datatable to display data in tabular form.
    let dataTable = new DataTable("#example", {
      paging: true, // Enable pagination
      pageLength: 2, // Set the number of entries per page to 5
      autoWidth: false, // Disable automatic column width calculation
      columns: [
        { title: "Project", width: "20%" }, // Adjust the width as needed
        { title: "Critical", width: "16%" }, // Adjust the width as needed
        { title: "Major", width: "16%" }, // Adjust the width as needed
        { title: "Minor/Moderate", width: "16%" }, // Adjust the width as needed
        { title: "Low", width: "16%" }, // Adjust the width as needed
        { title: "Details", width: "16%" }, // Adjust the width as needed
      ],
      data: dataSet,
      columnDefs: [
        {
          targets: 5,
          render: function (data, type, row) {
            return (
              '<button class="details-button" data-project="' +
              row[0] +
              '">Show</button>'
            );
          },
        },
      ],
      language: {
        paginate: {
          first:
            '<a href="#" class="paginate-button" aria-label="First"><i class="fas fa-backward custom-icon"></i></a>',
          previous:
            '<a href="#" class="paginate-button" aria-label="Previous"><i class="fas fa-backward custom-icon"></i></a>',
          next: '<a href="#" class="paginate-button" aria-label="Next"><i class="fas fa-forward custom-icon"></i></a>',
          last: '<a href="#" class="paginate-button" aria-label="Last"><i class="fas fa-forward custom-icon"></i></a>',
        },
      },
    });

    // Get the DataTable data
    let dataTableData = dataTable.data().toArray();

    // Extract project names
    let projectNames = dataTableData.map((row) => row[0]);
    let aggregatedBugData = []; 

    for(let projectName of projectNames){
      let response = await fetch("/bugs/projectBugsData", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify({ projectName})
      });
    
      let responseData = await response.json();

      aggregatedBugData.push(responseData.data);

    }


    document.getElementById('export-button').addEventListener('click', function () {
      exportToExcel(aggregatedBugData);
    });
  
    function exportToExcel(aggregatedBugData) {
      var completeBugData = [];
    
      for (let data of aggregatedBugData) {
        for (let item of data) {
          let bugData = {
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
    
          completeBugData.push(bugData);
        }
      }
  
      /* Convert data to workbook */
      var ws = XLSX.utils.json_to_sheet(completeBugData);
  
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
      saveAs(blob, `AllBugsReport_${currentDate}.xlsx`);
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


  //To Display chart Data.

    let chartData = dataSet.map((item) => {
      return {
        x: item[0], // Assuming project name is in the first column
        y:
          parseInt(item[1]) +
          parseInt(item[2]) +
          parseInt(item[3]) +
          parseInt(item[4]), // Sum of Critical, Major, Minor/Moderate, Low
      };
    });

    // Calculate the total bugs
    let totalBugs = chartData.reduce((sum, data) => sum + data.y, 0);

    // Calculate the percentage for each project
    let chartPercentageData = chartData.map((data) => {
      return {
        x: data.x,
        y: (data.y / totalBugs) * 100,
      };
    });

    // Options for the ApexCharts
    let chartOptions = {
      chart: {
        type: "pie",
      },
      series: chartPercentageData.map((data) => data.y),
      labels: chartPercentageData.map(
        (data) => `${data.x}: ${data.y.toFixed(2)}%`
      ),
    };

    // Initialize and render the chart
    let chart = new ApexCharts(document.querySelector("#chart"), chartOptions);
    chart.render();

    if (
      responseData.data.length >= 1 &&
      responseData.data[0].project_name !== null
    )
      showToast(responseData.message, "#65B741");
    else showToast("No bug data found", "#B31312");
  } else {
    document.querySelector("h3").innerHTML = "";
    showToast(responseData.message, "#B31312");
  }

  //Function to show details of specified project on click of show button.

  $("#example").on("click", ".details-button", async function () {
    // Retrieve the project name from the button's data attribute
    let projectName = $(this).data("project");

    localStorage.setItem("responseData", JSON.stringify(projectName));
    window.location.href = "./projectBugsInfo";
  });
});
