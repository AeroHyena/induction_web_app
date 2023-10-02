const express = require("express");
const router = express.Router();



// Define routes for reports page functionalities
router.get("/", (req, res) => {
    res.send("Generate reports here");
});


router.post("/", (req, res) => {
    res.send("POST detected on Reports page");
});


module.exports = router;