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
      alert("No report data to download");
    } else {
      
  
        // Extract raw data from page
        const extractedData = extractReportData();


        // construct raw data into pdf
        const doc = new jsPDF;
        let x = 20;
        let y = 20;

        doc.setFont("times", "rowan", "normal");
        doc.setFontSize(18);
        doc.text("FSOil - Induction Expiry Report", x, y);
        const currentDate = new Date();
        doc.text(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`, x + 136, y);
        doc.line(x, y + 1, x + 165, y + 1); // Adjust the y+1 value for the underline position
        y += 18;

        doc.setFontSize(12);
        doc.text(["This is a generated report describing any records of performed inductions that has expired, and/or", 
        "will expire soon."], x, y)
        y += 18;


        // Set up fonts to use in pdf
        console.log(doc.getFontList());

        for (let category in extractedData) {
        // Add a title with an underline
        
        doc.setFontSize(14);
        doc.text(category, x, y);
        // Draw an underline below the category name
        doc.line(x, y + 1, x + 85, y + 1); // Adjust the y+1 value for the underline position
        y += 12;


        doc.setFontSize(10);
          let column = 1;
        if (extractedData[category].length > 0) {
            
            extractedData[category].forEach((dataPoint, index) => {
                // Add datapoints
                if (column == 1) {
                  doc.text(" - Date Completed: " + dataPoint.DateCompleted, x, y);
                  y += 5;
                  doc.text(" - Full Names: " + dataPoint.FullNames, x, y);
                  y += 5;
                  doc.text(" - ID/Passport Number: " + dataPoint.IDOrPassport, x, y);
                  y += 5;
                  doc.text(" - Employee Number: " + dataPoint.EmployeeNumber, x, y); // Correct the variable name
                  y += 5;
                  doc.text(" - Video Watched: " + dataPoint.VideoWatched, x, y); // Correct the variable name.
                  
                  if (index == extractedData[category].length - 1) { y += 12 } else {
                    y -= 20;
                  }
                  column++;

                } else {
                  x += 100;
                  doc.text(" - Date Completed: " + dataPoint.DateCompleted, x, y);
                  y += 5;
                  doc.text(" - Full Names: " + dataPoint.FullNames, x, y);
                  y += 5;
                  doc.text(" - ID/Passport Number: " + dataPoint.IDOrPassport, x, y);
                  y += 5;
                  doc.text(" - Employee Number: " + dataPoint.EmployeeNumber, x, y); // Correct the variable name
                  y += 5;
                  doc.text(" - Video Watched: " + dataPoint.VideoWatched, x, y); // Correct the variable name.
                  y += 12;
                  x -= 100;
                  column--;
                }
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



