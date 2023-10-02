const express = require("express");
const router = express.Router();



// Define routes for search page functionalities
router.get("/", (req, res) => {
    res.send("Search page");
});


router.post("/", (req, res) => {
    res.send("POST detected on Search page");
});


module.exports = router;