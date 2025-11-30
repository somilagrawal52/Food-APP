const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  getUserController,
  updateUserController,
  resetPassword,
  updatePassword,
} = require("../controller/userController");
const { checkforauth } = require("../middleware/authMiddleware");

router.get("/getuser", checkforauth, getUserController);
router.put("/updateuser", checkforauth, updateUserController);
router.post("/resetpassword",checkforauth, resetPassword);
router.post("/updatepassword",checkforauth, updatePassword);
module.exports = router;
