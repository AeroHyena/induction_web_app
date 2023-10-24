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
          const dateCompleted = reportItem.querySelector('div:nth-child(2)').textContent.trim();
          const idOrPassport = reportItem.querySelector('div:nth-child(3)').textContent.trim();
          const fullNames = reportItem.querySelector('div:nth-child(4)').textContent.trim();
          const employeeNumber = reportItem.querySelector('div:nth-child(5)').textContent.trim();
          const CompanyContractor = reportItem.querySelector('div:nth-child(6)').textContent.trim();
          const videoWatched = reportItem.querySelector('div:nth-child(7)').textContent.trim();

          // Create an object to represent the data
          const dataPoint = {
            DateCompleted: dateCompleted,
            IDOrPassport: idOrPassport,
            FullNames: fullNames,
            EmployeeNumber: employeeNumber,
            CompanyContractor: CompanyContractor,
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
    

      // Extract raw data from the page
      const extractedData = extractReportData();

      // Create a new PDF document
      const doc = new jsPDF();
      let x = 20;
      let y = 20;

      // Your existing code for the title and date
      doc.setFont("times", "rowan", "normal");
      doc.setFontSize(18);
      doc.text("FSOil - Induction Expiry Report", x, y);
      const currentDate = new Date();
      doc.text(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`, x + 136, y);
      doc.line(x, y + 1, x + 165, y + 1);
      y += 18;

      doc.setFontSize(12);
      doc.text([
          "This is a generated report describing any records of performed inductions that have expired, and/or",
          "will expire soon."
      ], x, y);
      y += 18;

      // Set up fonts to use in PDF
      console.log(doc.getFontList());

      for (let category in extractedData) {
          // Add a title with an underline
          doc.setFontSize(14);
          doc.text(category, x, y);
          doc.line(x, y + 1, x + 85, y + 1);
          y += 12;

          doc.setFontSize(10);
          let column = 1;
          if (extractedData[category].length > 0) {
              extractedData[category].forEach((dataPoint, index) => {
                  // Add datapoints
                  if (y >= doc.internal.pageSize.height - 20) { // Check if content exceeds page height
                    doc.addPage(); // Add a new page
                    y = 20; // Reset y position
                  } 
                  if (column == 1) {
                      doc.text(" - Date Completed: " + dataPoint.DateCompleted, x, y);
                      y += 5;
                      doc.text(" - Full Names: " + dataPoint.FullNames, x, y);
                      y += 5;
                      doc.text(" - ID/Passport Number: " + dataPoint.IDOrPassport, x, y);
                      y += 5;
                      doc.text(" - Employee Number: " + dataPoint.EmployeeNumber, x, y);
                      y += 5;
                      doc.text(" - Company/Contractor: " + dataPoint.CompanyContractor, x, y);
                      y += 5;
                      doc.text(" - Video Watched: " + dataPoint.VideoWatched, x, y);
                      
                      if (index == extractedData[category].length - 1) { // if on last record for this category
                          y += 12;
                      } else {
                        y -= 25; // reset y for 2nd column
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
                      doc.text(" - Employee Number: " + dataPoint.EmployeeNumber, x, y);
                      y += 5;
                      doc.text(" - Company/Contractor: " + dataPoint.CompanyContractor, x, y);
                      y += 5;
                      doc.text(" - Video Watched: " + dataPoint.VideoWatched, x, y);
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

      // Save and download the PDF
      doc.save("report.pdf");
  }
}

const submit = document.getElementById("download");
submit.addEventListener("click", downloadPDF);



