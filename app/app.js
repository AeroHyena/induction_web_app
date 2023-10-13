/**
 * @module app
 * 
 * @summary Entry point. Sets up tools, the server, and holds all routes.
 * 
 * @overview This is the entry point for the web app.
 * In this file an express app is created, and all route modules from 
 * app/routes are imported and set up.
 * 
 * Routes generate html files using the ejs template engine.
 * There is a Template.ejs file with common page elements,
 * and each route has an ejs file with page-sepcific content.
 * On route access, the template and route ejs files are combined and served.
 * 
 * This script sets app/pages/media as a directory from which static 
 * files - media content - is served.
 */




/** Imports */
const path = require("path");
const express = require("express");
const sqlite3 = require('sqlite3').verbose();



/** Set up the sqlite3 database */
const db = new sqlite3.Database('database.db'); //create the database


/** Connect to the database, and create a table for induction data 
 * if one doesn't exist */
db.run(`
  CREATE TABLE IF NOT EXISTS inductions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_completed DATE DEFAULT CURRENT_TIMESTAMP,
    id_passport_nr TEXT NOT NULL,
    full_name TEXT NOT NULL,
    employee_nr INTEGER UNIQUE,
    video_watched TEXT NOT NULL
  )
`, (error) => {
  if (error) {
    console.error('Error creating table: ', error);
    return;
  }

  console.log('Table "inductions" created successfully!');
});



/** Set up the express app to be used */
const app = express();
app.use(express.static(path.join(__dirname, "/pages"))); // Serve static files from the pages directory
app.use(express.urlencoded({extended: true })); //parse URL-encoded data
app.set('db', db); // Set the database in the app



/** @default The server is served on the PORT environment variable, or on 8080 by default. */
const port = process.env.PORT || 8080;



/** Set up the ejs template engine */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pages")); // Set the directory of web files as /pages




/** Import route modules and pass in the database connec connection to the route modules */
const inductionRoutes = require("./routes/induction/induction")(app);
const searchRoutes = require("./routes/search/search.js")(app);
//const reportsRoutes = require("./routes/reports/reports.js")(app);
const loginRoutes = require("./routes/login/login.js")(app);
//const logoutRoutes = require("./routes/logout/logout.js")(app);



/** Use the Route modules */
app.use("/", inductionRoutes);
app.use("/search", searchRoutes);
//app.use("/reports", reportsRoutes);
app.use("/login", loginRoutes);
//app.use("/logout", logoutRoutes);



/** launch server on the specified port, and on host 0.0.0.0 */
app.listen(port, "0.0.0.0", () => {
    console.log("server is running on port " + port);
});