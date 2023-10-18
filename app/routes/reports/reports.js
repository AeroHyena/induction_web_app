/** 
 * @route for "/search"
 * @module Search
 * 
 * @summary Defines route for performing searches @"/search"
 * @overview This is an express route for performing searches on the induction database.
 * 
 * There is a search bar, and a results area.
 * 
 * The results area is updated with data as searches are performed.
 * --TODO-- add the ability to select different collumns for search
 */



/* imports and set up*/
const express = require("express");
const { todo } = require("node:test");
const router = express.Router();




/** 
 * @function module.exports
 * @summary Export the routes with the db as a paramater
 * @overview GET and POST routes are defined for the search page.
 * 
 * Get will render the search web page with a search bar and a results pane.
 * 
 * POST is used to perform the search and to return the results.
 * 
 * @param db - a database connection to database.db passed down from app.js
 * @returns The router used to set up the GET and POST routes
 */
module.exports = (db) => {


    /** GET route - renders the page */
    router.get("/", (req, res) => {


        // use template.ejs as base, and insert reports.ejs into the template page
        if (req.session.isLoggedIn) {
            res.status(200).render("template", {loggedIn: req.session.isLoggedIn, title: "Reports", contentPath: "reports"});
            console.log("Reports: @/get - reports.ejs rendered @" + new Date());
        } else {
            res.redirect("/");
            console.log("Reports: @/get - redirected from /reports - no user logged in @" + new Date());
        }
    });


    /** POST route - performs the search, and renders the page with the results. */
    router.post("/", (req, res) => {
        // Read the data
        console.log("Reports: POST detected - reading data...");

        let showExpired = (req) => req.body.showExpired === "on";
        let showWeek = (req) => req.body.showWeek === "on";
        let showMonth = (req) => req.body.showMonth === "on";


        // Check if any options were selected
        if (!showExpired && !showWeek && !showMonth) {
            res.status(422).send("Please make sure to select at least one option");
        }


        // Get the data from the database
        const db = req.app.get("db");

            db.all("SELECT * FROM inductions", (err, rows) => {
                if (err) {
                    console.log("error", err);
                } else {
                    const data = rows.map((row) => row); // Use map to extract rows
                
            
          


                    // Filter the data
                    const currentDate = Date.now();
                    const oneYearAgo = new Date(currentDate);
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                    
                    const oneWeekFromNow = new Date(currentDate);
                    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
                    
                    const oneMonthFromNow = new Date(currentDate);
                    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

                    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
                    const oneMonthInMilliseconds = 30.44 * 24 * 60 * 60 * 1000; // 30.44 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
                    const oneYear = 365 * 24 * 60 * 60 * 1000

                    const expired = [], expiresWeek = [], expiresMonth = [];
                    
                    data.forEach((record) => {
                        const databaseTimestamp = Date.parse(record.date_completed);
                        
                        // Calculate the difference in milliseconds between databaseTimestamp and the current date
                        const timeDifference = currentDate - databaseTimestamp;
                        
                        if (timeDifference < oneYear) {
                            if (timeDifference < oneWeekInMilliseconds) {
                                expiresWeek.push(record);
                            }
                            if (timeDifference < oneMonthInMilliseconds) {
                                expiresMonth.push(record);
                            }
                        } else {
                            expired.push(record);
                        }
                    });
                    
                    
                    

                    //console.log(expiresWeek, expiresMonth);

                    res.send({expiresWeek, expiresMonth});
                }
            });
        




    });
    

    return router;
};