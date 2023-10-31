/* Imports */
const jsPDF = require("jspdf")
const fs = require("fs");

/* Functions */
function filterRecordsByExpiry(records) {
    // set up date variables

    // Current date
    const currentDate = Date.now(); 

    // Year
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000
    
    // Week
    const oneWeekFromNow = new Date(currentDate);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    
    // Month
    const oneMonthFromNow = new Date(currentDate);
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    const oneMonthInMilliseconds = 30.44 * 24 * 60 * 60 * 1000; // 30.44 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

    // Set up return variables
    const expired = [], expiresWeek = [], expiresMonth = [];
    
    // Filter records
    records.forEach((record) => {
        const databaseTimestamp = Date.parse(record.date_completed);
        
        // Calculate the difference in milliseconds between databaseTimestamp and the current date
        const timeDifference = currentDate - databaseTimestamp;
        const timeLeft = oneYearInMilliseconds - timeDifference;
        
        if (timeDifference < oneYearInMilliseconds) { // if the record is not older than a year
            if (timeLeft <= oneWeekInMilliseconds) { // check if it expires in the next week
                expiresWeek.push(record);
            }
            if (timeLeft <= oneMonthInMilliseconds) { // check if it expires in the next month
                expiresMonth.push(record);
            }
        } else {
            expired.push(record);
        }
    });

    return {expired, expiresWeek, expiresMonth};
}



function generate(database) {
    const getData =  new Promise((resolve, reject) => {
        database.all("SELECT * FROM inductions", (err, rows) => {
            if (err) {
                console.log("error", err);
                reject(err);
            } else {
                const data = rows.map((row) => row); // Use map to extract rows
                const results = filterRecordsByExpiry(data);
                const render = {
                    "Expired": results.expired,
                    "Expires In A Week": results.expiresWeek,
                    "Expires In A Month": results.expiresMonth
                };
                resolve(render);
            }
            
        });
    });

    getData.then((result) => {
        recordsToPDF(result);
    });

    return "success";
}




function recordsToPDF(records) {

    // Create a new PDF document
    const doc = new jsPDF.jsPDF();
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

    
    
        
    

    for (let category in records) {
        
        // Add a title with an underline
        doc.setFontSize(14);
        doc.text(category, x, y);
        doc.line(x, y + 1, x + 85, y + 1);
        y += 12;

        doc.setFontSize(10);
        let column = 1;
        if (records[category].length > 0) {
            records[category].forEach((dataPoint, index) => {
                
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
                    
                    if (index == records[category].length - 1) { // if on last record for this category
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
    var pdfData = doc.output();

    fs.writeFile(__dirname + "/temp/output.pdf", pdfData, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('The file was saved!');
    });
}





module.exports = {
    generate,
    recordsToPDF,
    filterRecordsByExpiry
}

      