const express = require("express");
const router = express.Router();
const Resturant = require("../models/Resturant");
const { checkforauth } = require("../middleware/authMiddleware");
const { createResturant } = require("../controller/Resturant");

router.post("/createresturant",checkforauth,createResturant);

module.exports = router;