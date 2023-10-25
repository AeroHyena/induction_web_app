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
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");




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
            db = req.app.get("db");
            db.all(`SELECT * FROM users`, (error, rows) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(rows)
                    res.status(200).render("template", {loggedIn: req.session.isLoggedIn, role: req.session.role,
                        title: "Dashboard", contentPath: "dashboard", data: rows});
                    console.log("Dashboard: @/get - dashboard.ejs rendered @" + new Date());
                }
            })
        } else {
            res.redirect("/");
            console.log("Dashboard: @/get - redirected from /dashboard - no user logged in @" + new Date());
        }
    });


    /** POST route - performs the search, and renders the page with the results. */
    router.post("/", (req, res) => {
       res.send("POST detected on dashboard");
    });




    /* Set up sub-routes */

    router.post("/delete", (req, res) => {
        if (req.session.isLoggedIn) {
            if (req.session.userID == req.body.userID) {
                db = req.app.get("db");
                db.all(`SELECT * FROM users`, (error, rows) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(rows)
                        res.status(403).render("template", {loggedIn: req.session.isLoggedIn, role: req.session.role,
                            title: "Dashboard", contentPath: "dashboard", data: rows, alert: "Cannot delete the logged in account!"});
                        console.log("DashboardDelete : @/get - delete request rejected: cannot delete the logged in account");
                    }
                })
            } else {
                console.log(req.body);
                db.run(`DELETE FROM users WHERE id = ?`, req.body.userID, error => {
                    if(error) {
                        console.error("ERROR: ", error);
                    } else {
                        console.log(`DashboardDelete : @post - successfully deleted account with ID ${req.body.userID}`)  
                        res.redirect("/dashboard")
                    };
                });
            };

        } else {
            res.redirect("/");
            console.log("Dashboard: @/get - redirected from /dashboard - no user logged in @" + new Date());
        };
    });



    router.post("/create_account", (req, res) => {
        if (req.session.isLoggedIn) {
            console.log(req.body)
            db = req.app.get("db");

            const userData = [];
            userData.push(req.body.email);
            userData.push(bcrypt.hashSync(req.body.password, 10));
            userData.push(req.body.role);
            console.log(userData);

            db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, userData, error => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("DashBoardCreate_User : @POST - created new account");
                    db.all(`SELECT * FROM users`, (error, rows) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log(rows)
                            res.status(403).render("template", {loggedIn: req.session.isLoggedIn, role: req.session.role,
                                title: "Dashboard", contentPath: "dashboard", data: rows, alert: "You have successfully created a new account."});
                            console.log("DashboardCreate_User : @POST - rendered /dashboard @" + new Date());
                        }
                    })
                }
            })


        } else {
            //
        }
    })



    

    return router;
};