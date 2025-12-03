const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const { checkforauth } = require("../middleware/authMiddleware");
const{createFood}=require("../controller/Food");

router.post("/createfood", checkforauth, createFood);

module.exports = router;
