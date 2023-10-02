const express = require("express");
const router = express.Router();



// Define routes for logging out
router.get("/", (req, res) => {
    res.send("Log out");
});


router.post("/", (req, res) => {
    res.send("POST detected on Log Out page");
});


module.exports = router;