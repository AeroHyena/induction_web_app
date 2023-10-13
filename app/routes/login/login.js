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
const { REFUSED } = require("dns");
const express = require("express");
const { todo } = require("node:test");
const router = express.Router();
const passport = require("passport")




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

        if (!req.query.error) {
            res.status(200).render("template", {loggedIn: req.session.isLoggedIn, title: "Log In", contentPath: "login"});
        } else {
            res.send("Error logging in" + req.query.error);
        };
        console.log("Login.ejs rendered " + new Date() + req.query.error);
    });


    /** POST route - validates the credentials, and renders the page with the result. */
    router.post('/', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          if (err) { 
            return next(err); 
          }
          if (!user) { 
            return res.redirect('/login?error=Invalid username or password'); 
          }
          req.logIn(user, function(err) {
            if (err) { 
              return next(err); 
            }

            req.session.isLoggedIn = true;
            req.session.username = user.username;
            req.session.user_id = user.id;
            console.log(user.username + " is logged in successfully");

            return res.redirect('/');
          });
        })(req, res, next);
      });

    return router;
};