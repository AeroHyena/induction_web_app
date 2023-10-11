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
        res.status(200).render("template", {title: "Search Records", contentPath: "search", "data": [], "dataGiven": false});
        console.log("search.ejs rendered " + new Date());
    });


    router.post("/", (req, res) => {
        // Handle search queries here

        // Get the database
        const db = req.app.get("db")
        
        console.log(req.body.id_passport);
        // Query the database
        db.serialize(() => {
            db.all(`SELECT * FROM inductions
            WHERE id_passport_nr = ?`, req.body.id_passport, (err, rows) => {
                if (err) {
                    console.error(err.message);
                } else {       
                    res.status(200).render("template", {title: "Search Records", contentPath: "search", "data": rows, "dataGiven": true});
                    console.log("search.ejs rendered w/ database query data" + new Date());
                    console.log(rows);
                };
            });
        });

    });

    return router;
};