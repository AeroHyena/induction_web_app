window.jsPDF = window.jspdf.jsPDF;

function extractReportData() {
    // Get the main report container by its ID
    const reportContainer = document.getElementById('report');
  
    // Find all "reportEntry" elements within the report container
    const reportEntries = reportContainer.querySelectorAll('.reportEntry');

    // Create an object to store the extracted data, grouped by categories
    const extractedData = {};

    // Iterate through each "reportEntry" element
    reportEntries.forEach(reportEntry => {
      // Find the "reportTitle" element to determine the category
      const category = reportEntry.querySelector('.reportTitle').textContent.trim();

      // Initialize an array for the category if it doesn't exist
      if (!extractedData[category]) {
        extractedData[category] = [];
      }

      // Find the "reportList" div that contains the data entries
      const reportList = reportEntry.querySelector('.reportList');

      // Check if there are "reportItem" elements within the category
      if (reportList) {
        // Iterate through each "reportItem" element within the "reportList"
        const reportItems = reportList.querySelectorAll('.reportItem');
        reportItems.forEach(reportItem => {
          // Extract data points within each "reportItem"
          const dateCompleted = reportItem.querySelector('div:nth-child(1)').textContent.trim();
          const idOrPassport = reportItem.querySelector('div:nth-child(2)').textContent.trim();
          const fullNames = reportItem.querySelector('div:nth-child(3)').textContent.trim();
          const employeeNumber = reportItem.querySelector('div:nth-child(4)').textContent.trim();
          const videoWatched = reportItem.querySelector('div:nth-child(5)').textContent.trim();

          // Create an object to represent the data
          const dataPoint = {
            DateCompleted: dateCompleted,
            IDOrPassport: idOrPassport,
            FullNames: fullNames,
            EmployeeNumber: employeeNumber,
            VideoWatched: videoWatched,
          };

          // Add the data point to the respective category
          extractedData[category].push(dataPoint);
        });
      }
    });

    return extractedData
}



function downloadPDF() {
    const divToCapture = document.getElementById("report");
    const hasNoData = divToCapture.innerText.includes("Nothing to show");
  
    if (hasNoData) {
      alert("No report data to email");
    } else {
      
  
        // Extract raw data from page
        const extractedData = extractReportData();


        // construct raw data into pdf
        const doc = new jsPDF;
        let x = 10;
        let y = 10;


        for (let category in extractedData) {
        // Add a title
        doc.setFontSize(12);
        doc.text(category, x, y);
        y += 12;

        doc.setFontSize(10);

        if (extractedData[category].length > 0) {
            console.log(extractedData[category])
            extractedData[category].forEach(dataPoint => {
                // Add datapoints
                doc.text("Date Completed: " + dataPoint.DateCompleted, x, y);
                y += 5;
                doc.text("Full Names: " + dataPoint.FullNames, x, y);
                y += 5;
                doc.text("ID/Passport Number: " + dataPoint.IDOrPassport, x, y);
                y += 5;
                doc.text("Employee Number: " + dataPoint.EmployeeNumber, x, y); // Correct the variable name
                y += 5;
                doc.text("Video Watched: " + dataPoint.VideoWatched, x, y); // Correct the variable name.
                y += 12;
            });
        } else {
            doc.text("No data available.", x, y);
            y += 12;
        }
    }

    
        // download pdf
        doc.save("report.pdf");
    }
  }
  
  const submit = document.getElementById("download");
  submit.addEventListener("click", downloadPDF)



