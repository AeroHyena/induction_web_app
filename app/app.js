/** @overview This is the entry point for the web app.
 * In this file an express app is created, and all route modules from 
 * app/routes are imported and set up.
 * 
 * Routes generate html files using the ejs template engine.
 * There is a Template.ejs file with common page elements, and each
 * route has an ejs file with page-sepcific content.
 * On route access, the tem[plate and route ejs files are combined
 * and served.
 * 
 * This script sets app/pages/media as a directory from which static 
 * files - media content - is served.
 */
const path = require("path");
const express = require("express");


// Set up the express app to be used
const app = express();
app.use(express.static(__dirname + "/pages")); // Serve static files from the pages directory
const port = process.env.PORT || 8080;


// Set up the ejs template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pages")); // Set the directory of web files as /pages


// Import route modules
const inductionRoutes = require("./routes/induction/induction");
const searchRoutes = require("./routes/search/search.js");
const reportsRoutes = require("./routes/reports/reports.js");
const loginRoutes = require("./routes/login/login.js");
const logoutRoutes = require("./routes/logout/logout.js");


// Use the Route modules
app.use("/", inductionRoutes);
app.use("/search", searchRoutes);
app.use("/reports", reportsRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);


// launch server
app.listen(port, () => {
    console.log("server is running on port " + port);
});