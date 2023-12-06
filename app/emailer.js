/* Imports */
const jsPDF = require("jspdf");
const fs = require("fs");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const { clear } = require("console");
const mailgun = new Mailgun(formData);
const fsPromises = fs.promises;
require("dotenv").config();

class Emailer {
  constructor(database) {
    this.database = database;
    this.mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
    });
    this.schedule = 0;
    this.recipients = [];
    this.activeSchedule = null;
  }

  /**
   *
   * @param {Array} recipients
   */
  addRecipients(recipients) {
    this.recipients.push(...recipients);
  }

  removeRecipient(recipient) {
    const index = this.recipients.indexOf(recipient);
    if (index != -1) {
      this.recipients.splice(index, 1);
      console.log("Recipient removed successfully");
    } else {
      console.log(
        "Cannot remove recipient: Recipient not in list of recipients"
      );
    }
    return;
  }

  getRecipients() {
    return this.recipients;
  }

  getSchedule() {
    return this.schedule;
  }

  filterRecordsByExpiry(records) {
    // set up date variables

    // Current date
    const currentDate = Date.now();

    // Year
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;

    // Week
    const oneWeekFromNow = new Date(currentDate);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

    // Month
    const oneMonthFromNow = new Date(currentDate);
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    const oneMonthInMilliseconds = 30.44 * 24 * 60 * 60 * 1000; // 30.44 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

    // Set up return variables
    const expired = [],
      expiresWeek = [],
      expiresMonth = [];

    // Filter records
    records.forEach((record) => {
      const databaseTimestamp = Date.parse(record.date_completed);

      // Calculate the difference in milliseconds between databaseTimestamp and the current date
      const timeDifference = currentDate - databaseTimestamp;
      const timeLeft = oneYearInMilliseconds - timeDifference;

      if (timeDifference < oneYearInMilliseconds) {
        // if the record is not older than a year
        if (timeLeft <= oneWeekInMilliseconds) {
          // check if it expires in the next week
          expiresWeek.push(record);
        }
        if (timeLeft <= oneMonthInMilliseconds) {
          // check if it expires in the next month
          expiresMonth.push(record);
        }
      } else {
        expired.push(record);
      }
    });

    return { expired, expiresWeek, expiresMonth };
  }

  generateReport(database) {
    database.all("SELECT * FROM inductions", (err, rows) => {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        const data = rows.map((row) => row); // Use map to extract rows
        const results = this.filterRecordsByExpiry(data);
        const render = {
          Expired: results.expired,
          "Expires In A Week": results.expiresWeek,
          "Expires In A Month": results.expiresMonth,
        };

        this.recordsToPDF(render);
        this.sendEmail();
      }
    });

    console.log("Report generated");
    return "success";
  }

  recordsToPDF(records) {
    // Create a new PDF document
    const doc = new jsPDF.jsPDF();
    let x = 20;
    let y = 20;

    // Your existing code for the title and date
    doc.setFont("times", "rowan", "normal");
    doc.setFontSize(18);
    doc.text("FSOil - Induction Expiry Report", x, y);
    const currentDate = new Date();
    doc.text(
      `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()}`,
      x + 136,
      y
    );
    doc.line(x, y + 1, x + 165, y + 1);
    y += 18;

    doc.setFontSize(12);
    doc.text(
      [
        "This is a generated report describing any records of performed inductions that have expired, and/or",
        "will expire soon.",
      ],
      x,
      y
    );
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
          if (y >= doc.internal.pageSize.height - 20) {
            // Check if content exceeds page height
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
            doc.text(
              " - Company/Contractor: " + dataPoint.CompanyContractor,
              x,
              y
            );
            y += 5;
            doc.text(" - Video Watched: " + dataPoint.VideoWatched, x, y);

            if (index == records[category].length - 1) {
              // if on last record for this category
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
            doc.text(
              " - Company/Contractor: " + dataPoint.CompanyContractor,
              x,
              y
            );
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
    const pdfData = doc.output();

    fs.writeFile(__dirname + "/temp/output.pdf", pdfData, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  }

  sendEmail() {
    fsPromises.readFile(__dirname + "/temp/output.pdf").then((data) => {
      const file = {
        filename: "report.pdf",
        data,
      };

      this.mg.messages
        .create("sandbox35211fa874a14926aba2640af5619b8f.mailgun.org", {
          from: "fsoil.inductions@gmail.com",
          to: this.recipients,
          subject: "Inductions Report On Expired/Expiring Inductions",
          text: [
            "Please find attached a report of any induction record that are expired and/or will be expiring soon.",
            "Kind regards",
            "FSOil induction app",
          ],
          html: [
            "<p>Please find attached a report of any induction record that are expired and/or will be expiring soon.</p><br>",
            "<p>Kind regards,<br>FSOil Induction App<p>",
          ],
          attachment: file,
        })
        .then((msg) => console.log(msg)) // logs response data
        .catch((err) => console.log(err)); // logs any error
    });
  }

  setSchedule(days) {
    this.schedule = days;
    console.log("Email schedule updated");
    return;
  }

  activateSchedule() {
    const dayInMS = 1000 * 60 * 60 * 24;
    const days = this.getSchedule();
    this.activeSchedule = setInterval(() => {
      this.generateReport(this.database);
    }, dayInMS * days);
    console.log("Scheduled emails activated");
    return "success";
  }

  clearSchedule() {
    clearInterval(this.activeSchedule);
    return "success";
  }
}

module.exports = {
  Emailer,
};
