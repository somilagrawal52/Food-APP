const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  getUserController,
  updateUserController,
  resetPassword,
  updatePassword,
  deleteProfile,
  getAllUsers,
  updateUserRole
} = require("../controller/userController");
const { checkforauth } = require("../middleware/authMiddleware");
const { checkforadmin } = require("../middleware/adminMiddleware");

router.get("/getuser", checkforauth, getUserController);
router.put("/updateuser", checkforauth, updateUserController);
router.post("/resetpassword", resetPassword);
router.post("/updatepassword",checkforauth, updatePassword);
router.delete("/deleteuser/:id",checkforauth,deleteProfile);

// Admin routes
router.get("/getallusers", checkforauth, checkforadmin, getAllUsers);
router.put("/updaterole", checkforauth, checkforadmin, updateUserRole);
module.exports = router;
