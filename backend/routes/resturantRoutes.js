const express = require("express");
const router = express.Router();
const Resturant = require("../models/Resturant");
const { checkforauth } = require("../middleware/authMiddleware");
const { checkforadmin } = require("../middleware/adminMiddleware");
const { checkforvendor } = require("../middleware/vendorMiddleware");
const {
  createResturant,
  getAllResturants,
  getMyResturants,
  getResturantById,
  updateResturant,
  deleteResturant,
} = require("../controller/Resturant");

router.post("/createresturant", checkforauth, checkforvendor, createResturant);
router.get("/getallresturants", getAllResturants);
router.get("/myresturants", checkforauth, checkforvendor, getMyResturants);
router.get("/resturant/:id", getResturantById);
router.put("/resturant/:id", checkforauth, checkforvendor, updateResturant);
router.delete("/resturant/:id", checkforauth, checkforvendor, deleteResturant);

module.exports = router;
