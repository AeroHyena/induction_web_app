const express = require("express");
const router = express.Router();



// Define routes for induction page functionalities
router.get("/", (req, res) => {
    // use template.ejs as base, and insert induction.ejs into the templates page
    res.render("template", {title: "FSOil Induction", contentPath: "induction"});
});


router.post("/", (req, res) => {
    // handle form submissions here
    res.send("POST detected on Induction page");
});


module.exports = router;