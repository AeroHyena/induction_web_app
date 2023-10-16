/**
 * @module authenticate
 * 
 * @summary Sets up the LocalStrategy used by Passport.js for authentication
 * 
 * @overview In this file the LocalStrategy for Passport.js is set up.
 * 
 * It is responsible for verifying user-provided credentials against the users table in database.db.
 * If a valid match is found, the user will be logged in an session data will be updated.
 * 
 * serializeUser() and deserializeUser() handle storing user IDs in session data, and 
 * retrieving user data using said user ID.
 */


/** imports */
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");



/** 
 * @function module.exports
 * @summary Export the localStrategy set up.
 * @overview LocalStrategy is set up for Passport.js authentication. 
 * 
 * serializeUser and deserializeUser functions are provided to store user IDs and retrieve user data with said ID.
 * 
 * @param db - a database connection to database.db passed down from app.js
 * @param passport - a connection to passport.js
 */
module.exports = (passport, db) => {

    passport.use(new LocalStrategy(
        {
        usernameField: "username",
        passwordField: "password"
        },
        (username, password, done) => {
        db.get(`SELECT * FROM users WHERE username = ?`, username, (err, row) => {
            console.log("Authenticate: checking credentials...")

            // Check is user is present in database
            if (!row) {
                console.log("Authenticate: ", username, " - User does not exit")
                return done(null, false, { message: "User does not exist" });
            }

            // Check if the passwords match
            if (!bcrypt.compareSync(password, row.password)) {
                console.log("Authenticate: ", username, " - Password is not valid");;
                return done(null, false, { message: "Password is not valid." });
            }
            
            return done(null, row);
        });
        }
    ));
    
    /** 
     * @function serializeUser()
     * @summary Store user ID in session data
     * @param user - an object with user data */
    passport.serializeUser(function(user, done) {
        console.log("Authenticate: serializeUser - user id added to session data")
        done(null, user.id);
    });
    
    /** 
     * @function deserializeUser()
     * @overview Access additional user data on every Paspsort request 
     * @param id - the ID of the user's database entry
     * */
    passport.deserializeUser(function(id, done) {
        console.log("Authenticate: deserialseUser - accessing user data...")
        db.get(`SELECT * FROM users WHERE id = ?`, id, (err, row) => {
        if (err) { return done(err); }
        done(null, row);
        });
    });
}