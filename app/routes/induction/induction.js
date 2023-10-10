const express = require("express");
const { todo } = require("node:test");
const router = express.Router();


function validateSAIDNumber(idNumber) {
    // Check that the ID number is 13 digits long
    if (idNumber.length !== 13) {
      return false;
    }
  
    // Calculate the Luhn checksum
    let sum = 0;
    for (let i = 0; i < idNumber.length - 1; i++) {
      let digit = parseInt(idNumber.charAt(i));
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
    }
  
    // Check that the Luhn checksum matches the last digit of the ID number
    return sum % 10 === parseInt(idNumber.charAt(12));
  }
  


/** Export the routes with the db as a paramater
 * @param database - a database connection passed down from app.js
 */
module.exports = (db) => {

    // Define routes for induction page functionalities
    router.get("/", (req, res) => {

        // use template.ejs as base, and insert induction.ejs into the templates page
        res.render("template", {title: "FSOil Induction", contentPath: "induction", formStatus: "None"});
        console.log("Induction.ejs rendered " + new Date() )
    });


    router.post("/", (req, res) => {
        // handle form submissions here

        console.log("Post detected on induction route - reading data");
        console.log(req.body);

        
        // Check the data to see if it is valid

        // Is the video watched in full?
        if (!req.body.videoWatched) {
            res.render("template", {title: "FSOil Induction", contentPath: "induction", formStatus: "!video"});
        }

        // Is the ID/Passport number provided valid?
        ID = req.body.id_passport_nr;
        if (!validateSAIDNumber(ID)) {
            if (ID.length > 15 || ID.length < 6) {
                res.render("template", {title: "FSOil Induction", contentPath: "induction", formStatus: "!id_passport"});
            }
        }

        // If an employee number is provided, is it valid?
        if (req.body.employeeNumber) {
            if (!+req.body.employeeNumber) {
                res.render("template", {title: "FSOil Induction", contentPath: "induction", formStatus: "!employee_nr"});
            }
        }
        
        

       // Create an array with data to be inserted into the database
        const data = [req.body.full_names, req.body.id_passport_nr, req.body.employee_nr, req.body.videoWatched];

        // Get the database connection from app.js
        const db = req.app.get("db")
        console.log(db);

        // insert data into database 
        db.run(`INSERT INTO inductions (id_passport_nr, full_name, employee_nr, video_Watched) VALUES (?, ?, ?, ?)`, data, function(error) {
            if(error) {
                return console.log(error.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
        res.render("template", {title: "FSOil Induction", contentPath: "induction", formStatus: "success"});
    });

    return router;
    //module.exports = router;
};