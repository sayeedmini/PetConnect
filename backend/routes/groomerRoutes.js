const express = require("express");
const router = express.Router();
const { searchGroomers, getGroomerById } = require("../controllers/groomerController");

router.get("/search", searchGroomers);
router.get("/:id", getGroomerById);

module.exports = router;
