const express = require("express");
const { todo } = require("node:test");
const router = express.Router();



/** Export the routes with the db as a paramater
 * @param database - a database connection passed down from app.js
 */
module.exports = (db) => {

    // Define routes for induction page functionalities
    router.get("/", (req, res) => {

        // use template.ejs as base, and insert search.ejs into the template page
        res.status(200).render("template", {title: "Search Records", contentPath: "search"});
        console.log("search.ejs rendered " + new Date());
    });


    router.post("/", (req, res) => {
        // Handle search queries here
        res.send("Search results go here");
    });

    return router;
};