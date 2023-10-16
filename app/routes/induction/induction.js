/** 
 * @route for "/"
 * @module Induction
 * 
 * @summary Defines route for inductions @"/"
 * @overview This is an express route for performing inductions.
 * 
 * Users are prompted to watch a video and fill in a form.
 * 
 * If the video is not watched, or the form data is not correct,
 * the user will be given an alert with appropriate information.
 */





/** imports and set up */
const express = require("express");
const { todo } = require("node:test");
const router = express.Router();





/** 
 * @function validateSAIDNumber
 * @summary Checks if a given South African number is valid.
 * @Overview This is a function that validates the provided South African ID number.
 * 
 * It does so by applying the Luhn algorithm to the ID number. 
 * --TODO--
 * 
 * @param idNumber - The ID number to be validated.
 * @returns A boolean value
 */
function validateSAIDNumber(idNumber) {
    console.log("Induction: ValidateSAIDNumber - Validating ID number ...");
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
  




/** 
 * @function module.exports
 * @summary Export the routes with the db as a paramater
 * @overview GET and POST routes are defined for the induction page.
 * 
 * Get will render the induction web page with a video and a form to be filled.
 * 
 * POST is used to validate form data, and on successful validation will insert the data
 * into the database.
 * 
 * @param db - a database connection to database.db passed down from app.js
 * @returns The router used to set up the GET and POST routes
 */
module.exports = (db) => {



    /** GET route - render page */
    router.get("/", (req, res) => {



        /** use template.ejs as base, and insert induction.ejs into the template page */
        res.status(200).render("template", {loggedIn: req.session.isLoggedIn, title: "FSOil Induction",
            contentPath: "induction",  check: null});
        console.log("Induction: @/get - induction.ejs rendered @" + new Date() )
        console.log("Indcuction: @/get - user login status = ", req.session.isLoggedIn);
    });





    /** POST route - handle form submissions */
    router.post("/", (req, res) => {
        console.log("Induction: @/post - reading data");

        let db = req.app.get("db");


        /** 
         * Check the data to see if it is valid.
         * An object with the result is created:
         * check - holds a status, message and code value to be used for rendering the result page
         */
        console.log("Induction: @/post - form data recieved; initializing checks ...")
        const check = {
            status: "",
            message: "",
            code: 0
        }



        /** Check if the video is watched in full */
        if (!req.body.videoWatched) {
            console.log("Induction: @/post - induction rejected: video not watched fully.");
            check.status = "Video not fully watched!";
            check.message = "Please make sure you watch the video before submitting the form.";
            check.code = 422;
        }



        /** Check if the provided ID/Passpoirt is valid */
        console.log("Induction @/post: Checking ID/Passport ...");

        ID = req.body.id_passport_nr;
        if (!validateSAIDNumber(ID)) {
            if (ID.length > 15 || ID.length < 6) {
                console.log("Induction: @/post - induction rejected: ID/Passport not valid");
                 check.status = "Id/Passport not valid!";
                 check.message = "Please check that you insert a valid South African ID or passport number.";
                 check.code = 422;
            }
        }



        /** Check if the optional employee number is valid --TODO-- */
        if (req.body.employeeNumber) {
            if (!+req.body.employeeNumber) {
                console.log("Induction: @/post - induction rejected: employee number not valid");
                check.status = "Employee number not valid!";
                check.message = "Please check that you insert a valid employee number - do not append any letters.";
                check.code = 422;
            }
        }

        // Check complete
        console.log("Induction: @/post - Checks complete: no errors found in the provided data");

        

        /** If the data checks have not found any errors, commit the data into the database */
        if (check.message == "") {
            const data = [req.body.id_passport_nr, req.body.full_names, req.body.employee_nr, req.body.videoWatched];
            

            /** 
             * Check if there is already data inside the database for this user - 
             * Do this by utilizing the ID number since that must be unique for all users
             * */ 
            db.get(`SELECT * FROM inductions
            WHERE id_passport_nr LIKE ?`, data[0], function(error, row) {

                if(error) {
                    return console.log(error.message);


                } else {
                    let checked = row;

                    /** If there is no record, add a new one */
                    if (typeof(checked) == "undefined") {
                        console.log("Induction: @/post - inserting new data into database");
                        db.run(`INSERT INTO inductions (id_passport_nr, full_name, employee_nr, video_Watched) 
                        VALUES (?, ?, ?, ?)`, data, function(error) {


                            if(error) {
                                return console.log(error.message);
                            }
                            console.log("Induction: @/post - a new entry has been made into the database with ID " + this.lastID);


                    })} else {



                        /** If there is an existing record, update it */
                        console.log("Induction: @/post - existing data found in db: ", checked);
                        db.run(`UPDATE inductions SET (id_passport_nr, full_name, employee_nr, video_Watched)
                        = (?, ?, ?, ?)  WHERE id = ${checked.id}`, data, function(error) {

                            if(error) {
                                return console.log(error.message);
                            }
                            console.log("Induction: @/post - an entry in the database has been updated (ID = " + checked.id + ")");
                        });
                    };
                };
            });

            
            
            check.status = "Success!";
            check.message = "You have successfully performed the induction.";
            check.code = 201;
        };



        /** 
         * Render the page and provide the reults. The induction.ejs page 
         * will handle the result and render the appropriate alert.
         * */
        res.status(check.code).render("template", {loggedIn: req.session.isLoggedIn, title: "FSOil Induction", contentPath: "induction", check});
        console.log("Induction: @/post: the data and its result has been rendered");
    });

    return router;
};