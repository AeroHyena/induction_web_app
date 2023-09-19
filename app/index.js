/* this is the entry point of the app.
In this module the back-end, database, routes 
and functions are outlined and structured. */



// Import modules
const express = require("express");


// Define important variables
const port = proces.env.PORT || 8080;
const app = express();



// define the routes of the app
app.get("/", (req, res => {            // induction page
    res.send("Induction Page");
}));

app.get("/", (req, res => {            // search page
    res.send("Serach the database here");
}));

app.get("/", (req, res => {            // reports page
    res.send("Build reports here");
}));

app.get("/", (req, res => {            // administration
    res.send("Administrative options");
}));

app.get("/", (req, res => {            // log in
    res.send("log in");
}));

app.get("/", (req, res => {            // log out
    res.send("log out");
}));



// Launch the server
app.listen(port, () => {
    comsole.log('server active on port ${port}');
});