const express = require("express");
const router = express.Router();



// Define routes for logging in
router.get("/", (req, res) => {
    res.send("Log in");
});


router.post("/", (req, res) => {
    res.send("POST detected on Log in page");
});


module.exports = router;