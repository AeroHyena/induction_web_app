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
        res.status(200).render("template", {title: "FSOil Induction", contentPath: "induction",  check: null});
        console.log("Induction.ejs rendered " + new Date() )
    });

    /** POST route - handle form submissions */
    router.post("/", (req, res) => {
        console.log("Post detected on induction route - reading data");

        /** 
         * Check the data to see if it is valid.
         * An object with the result is created:
         * check - holds a status, message and code value to be used for rendering the result page
         */
        const check = {
            status: "",
            message: "",
            code: 0
        }

        /** Check if the video is watched in full */
        if (!req.body.videoWatched) {
            check.status = "Video not fully watched!";
            check.message = "Please make sure you watch the video before submitting the form.";
            check.code = 422;
        }

        /** Check if the provided ID/Passpoirt is valid */
        ID = req.body.id_passport_nr;
        if (!validateSAIDNumber(ID)) {
            if (ID.length > 15 || ID.length < 6) {
                 check.status = "Id/Passport not valid!";
                 check.message = "Please check that you insert a valid South African ID or passport number.";
                 check.code = 422;
            }
        }

        /** Check if the optional employee number is valid --TODO-- */
        if (req.body.employeeNumber) {
            if (!+req.body.employeeNumber) {
                check.status = "Employee number not valid!";
                check.message = "Please check that you insert a valid employee number - do not append any letters.";
                check.code = 422;
            }
        }
        
        /** If the data checks have not found any erros, commit the data into the database */
        if (check.message == "") {
            const data = [req.body.id_passport_nr, req.body.full_names, req.body.employee_nr, req.body.videoWatched];

            /** Get the database connection from app.js */
            const db = req.app.get("db")

            /** Insert the data into the database. This is an SQLite query that will insert the data */ 
            db.run(`INSERT INTO inductions (id_passport_nr, full_name, employee_nr, video_Watched) VALUES (?, ?, ?, ?)`, data, function(error) {
                if(error) {
                    return console.log(error.message);
                }
                /** Get the last insert id, and print it in the console */
                console.log(`A row has been inserted with ID ${this.lastID}`);
            });
            check.status = "Success!";
            check.message = "You have successfully performed the induction.";
            check.code = 201;
        };

        /** 
         * Render the page and provide the reults. The induction.ejs page 
         * will handle the result and render the appropriate alert.
         * */
        res.status(check.code).render("template", {title: "FSOil Induction", contentPath: "induction", check});
        console.log("The data and its result has been rendered: \n", check);
    });

    return router;
};