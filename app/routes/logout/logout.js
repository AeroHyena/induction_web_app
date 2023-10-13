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
const router = express.Router();




/** 
 * @function module.exports
 * @summary Export the routes with the db as a paramater
 * @overview GET and POST routes are defined for the logout route.
 * 
 * Get will log the user out and redirect them to the main page.
 * 
 * POST will redirect tot he main page.
 * 
 * @param db - a database connection to database.db passed down from app.js
 * @returns The router used to set up the GET and POST routes
 */




/** GET route - renders the page */
router.get("/", (req, res) => {

    // If a user is logged in, log them out
    if (req.session.isLoggedIn) {

        req.session.isLoggedIn = false;
        req.session.username = "";
        req.session.user_id = "";
        req.logout(function(err) {
            if (err) { return next(err); }
        });

        res.redirect("/");
        console.log("user is logged out successfully");
    } else {
        res.redirect("/");
    }
});

module.exports = router;
