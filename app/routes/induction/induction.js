const express = require("express");
const router = express.Router();



// Define routes for induction page functionalities
router.get("/", (req, res) => {
    res.render("induction");
});


router.post("/", (req, res) => {
    res.send("POST detected on Induction page");
});


module.exports = router;