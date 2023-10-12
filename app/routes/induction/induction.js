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

        // use template.ejs as base, and insert induction.ejs into the template page
        res.status(200).render("template", {title: "FSOil Induction", contentPath: "induction",  check: null});
        console.log("Induction.ejs rendered " + new Date() )
    });


    router.post("/", (req, res) => {
        // handle form submissions here

        console.log("Post detected on induction route - reading data");
        console.log(req.body);

        
        // Check the data to see if it is valid
        const check = {
            status: "",
            message: "",
            code: 0
        }

        // Is the video watched in full?
        if (!req.body.videoWatched) {
            check.status = "Video not fully watched!";
            check.message = "Please make sure you watch the video before submitting the form.";
            check.code = 422;
        }

        // Is the ID/Passport number provided valid?
        ID = req.body.id_passport_nr;
        if (!validateSAIDNumber(ID)) {
            if (ID.length > 15 || ID.length < 6) {
                 check.status = "Id/Passport not valid!";
                 check.message = "Please check that you insert a valid South African ID or passport number.";
                 check.code = 422;
            }
        }

        // If an employee number is provided, is it valid?
        if (req.body.employeeNumber) {
            if (!+req.body.employeeNumber) {
                check.status = "Employee number not valid!";
                check.message = "Please check taht you insert a valid employee number - do not append any letters.";
                check.code = 422;
            }
        }
        
        
        if (check.message == "") {
        // Create an array with data to be inserted into the database
            const data = [req.body.id_passport_nr, req.body.full_names, req.body.employee_nr, req.body.videoWatched];

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
            check.status = "Success!";
            check.message = "You have successfully performed the induction.";
            check.code = 201;
        };

        res.status(check.code).render("template", {title: "FSOil Induction", contentPath: "induction", check});
    });

    return router;
    //module.exports = router;
};