const express = require("express");
const router = express.Router();




// Define routes for induction page functionalities
router.get("/", (req, res) => {
    // use template.ejs as base, and insert induction.ejs into the templates page
    res.render("template", {title: "FSOil Induction", contentPath: "induction"});
    console.log("Induction.ejs rendered " + new Date() )
});


router.post("/", (req, res) => {
    // handle form submissions here
    console.log("Post detected on induction route - reading data");
    console.log(req.body);

    res.send("form data posted successfully" + req.body)
});


module.exports = router;