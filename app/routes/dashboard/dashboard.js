/** 
 * @route for "/dashboard"
 * @module Dashboard
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
        if (req.session.isLoggedIn) {
            res.status(200).render("template", {loggedIn: req.session.isLoggedIn, title: "Dashboard", contentPath: "dashboard"});
            console.log("Dashboard: @/get - dashboard.ejs rendered @" + new Date());
        } else {
            res.redirect("/");
            console.log("Dashboard: @/get - redirected from /dashboard - no user logged in @" + new Date());
        }
    });


    /** POST route - performs the search, and renders the page with the results. */
    router.post("/", (req, res) => {
       res.send("POST detected on dashboard");
    });
    

    return router;
};