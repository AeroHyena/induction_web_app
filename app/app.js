const path = require("path");
const express = require("express");


// Set up express app
const app = express();
app.use(express.static(__dirname + "/pages")); // Serve static files from the pages directory
const port = process.env.PORT || 8080;


// Set up ejs template engine
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