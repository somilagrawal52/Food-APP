const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  registerController,
  loginController,
} = require("../controller/AuthController");

//Register user
router.post("/register", registerController);
router.post("/login", loginController);

module.exports = router;
