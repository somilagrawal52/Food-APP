const express = require("express");
const router = express.Router();
const Resturant = require("../models/Resturant");
const { checkforauth } = require("../middleware/authMiddleware");
const {
  createResturant,
  getAllResturants,
  getResturantById,
  deleteResturant,
} = require("../controller/Resturant");

router.post("/createresturant", checkforauth, createResturant);
router.get("/getallresturants", checkforauth, getAllResturants);
router.get("/resturant/:id", checkforauth, getResturantById);
router.delete("/resturant/:id", checkforauth, deleteResturant);
module.exports = router;
