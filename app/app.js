const express = require("express");
const app = express();


// Import route modules
const inductionRoutes = require("./routes/induction/induction.js");


// Use the Route modules
app.use("/", inductionRoutes)




// launch server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("server is running on port " + port);
});