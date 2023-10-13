/** 
 * @route for "/login"
 * @module Login
 * 
 * @summary Defines routes for logging in @"/login"
 * @overview This is an express route for loggin in and creating session data.
 * 
 * On the GET route, a login box will be rendered.
 * 
 * On POST, the credentials will be validated. If valid, session data will be created.
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
 * Get will render the login page with a log in box.
 * 
 * POST is used to validate the provided credentials
 * 
 * @param db - a database connection to database.db passed down from app.js
 * @returns The router used to set up the GET and POST routes
 */


module.exports = (db) => {
    
    /** GET route - renders the page */
    router.get("/", (req, res) => {

        // use template.ejs as base, and insert search.ejs into the template page
        res.status(200).render("template", {title: "Log In", contentPath: "login"});
        console.log("Login.ejs rendered " + new Date());
    });


    /** POST route - validates the credentials, and renders the page with the result. */
    router.post("/", (req, res) => {

        /** Get the database connection from app.js */
        const db = req.app.get("db");
        console.log("POST detected on /search");

    });

    return router;
};