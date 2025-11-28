const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  getUserController,
  updateUserController,
} = require("../controller/userController");
const { checkforauth } = require("../middleware/authMiddleware");

router.get("/getuser", checkforauth, getUserController);
router.put("/updateuser", checkforauth, updateUserController);

module.exports = router;
