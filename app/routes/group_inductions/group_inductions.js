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

        if (req.session.isLoggedIn) {
            /** use template.ejs as base, and insert induction.ejs into the template page */
            res.status(200).render("template", {loggedIn: req.session.isLoggedIn, title: "FSOil Group Inductions",
                contentPath: "group_inductions",  check: null});
            console.log("GroupInductions : @/get - induction.ejs rendered @" + new Date() );
        } else {
            res.status(403).redirect("/");
            console.log("GroupInductions : @/get - access denied: no log in data found. User has been redirected to /");
        }
    });




    router.post("/", (req, res) => {
        if (req.session.isLoggedIn){
            console.log(req.body);

            let length = (Object.keys(req.body).length / 4) -1;
            console.log(length + " records have been submitted")

            let names = [
                "name",
                "id_passport",
                "employeeNr",
                "contractor"
            ];

            // Assemble data
            let data = [];

            for(let index = 1; index < length + 1; index++) {
                let dataPoint = [];
                names.forEach((name) => {
                    const item = name + index;
                    if (req.body[item]) {
                        dataPoint.push(req.body[item])
                    } else {
                        dataPoint.push(null);
                    }
                });
                
                dataPoint.push("true");   
                console.log(dataPoint);
                data.push(dataPoint);
            }

            
             /** 
             * Check if there is already data inside the database for this user - 
             * Do this by utilizing the ID number or Employee number since that must be unique for all users
             * */ 
            const db = req.app.get("db");
            data.forEach(dataPoint => {

                db.get(`SELECT * FROM inductions
                WHERE id_passport_nr = ? OR employee_Nr = ?`, [dataPoint[1], dataPoint[2]], function(error, row) {
    
                    if(error) {
                        return console.log(error.message);
    
    
                    } else {
                        let checked = row;
    
                        /** If there is no record, add a new one */
                        if (typeof(checked) == "undefined") {
                            console.log("GroupInductions: @/post - inserting new data into database");
                            db.run(`INSERT INTO inductions (full_name, id_passport_nr, employee_nr, company_contractor, video_Watched) 
                            VALUES (?, ?, ?, ?, ?)`, dataPoint, function(error) {
    
    
                                if(error) {
                                    return console.log(error.message);
                                }
                                console.log("GroupInductions: @/post - a new entry has been made into the database with ID " + this.lastID);
    
    
                        })} else {
    
    
    
                            /** If there is an existing record, update it */
                            console.log("GroupInductions: @/post - existing data found in db: ", checked);
                            db.run(`UPDATE inductions SET ( full_name, id_passport_nr, employee_nr, company_contractor, video_Watched)
                            = (?, ?, ?, ?, ?)  WHERE id = ${checked.id}`, dataPoint, function(error) {
    
                                if(error) {
                                    return console.log(error.message);
                                }
                                console.log("GroupInductions: @/post - an entry in the database has been updated (ID = " + checked.id + ")");
                                
                            });
                        };
                    };
                });
            });
            res.status(200).render("template", {loggedIn: req.session.isLoggedIn, title: "FSOil Group Inductions",
                contentPath: "group_inductions",  check: null, alert: "You have successfully inserted records into the database"});
            } else {
                res.status(403).redirect("/");
                console.log("GroupInductions : @/post - access denied: no log in data found. User has been redirected to /");
            }
        })

    return router;
}