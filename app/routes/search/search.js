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

        // use template.ejs as base, and insert search.ejs into the template page
        res.status(200).render("template", {title: "Search Records", contentPath: "search", "data": [], "dataGiven": false});
        console.log("search.ejs rendered " + new Date());
    });


    /** POST route - performs the search, adn renders the page with the results. */
    router.post("/", (req, res) => {

        /** Get the database connection from app.js */
        const db = req.app.get("db");
        console.log("POST detected on /search");


        /** Execute a query on the database with the provided parameters */
        db.serialize(() => {
            db.all(`SELECT * FROM inductions
            WHERE ${req.body.option}  LIKE ?`, [`%${req.body.value}%`], (err, rows) => {
                if (err) {
                    console.error(err.message);
                } else {       
                    /** Render the page with the results */
                    res.status(200).render("template", {title: "Search Records", contentPath: "search", "data": rows, "dataGiven": true});
                    console.log("search.ejs rendered w/ database query data" + new Date());
                    console.log(rows);
                };
            });
        });

    });

    return router;
};