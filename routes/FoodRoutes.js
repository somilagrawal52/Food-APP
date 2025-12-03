const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const { checkforauth } = require("../middleware/authMiddleware");
const {
  createFood,
  getAllFoods,
  getFoodById,
  getFoodByResturant,
  updateFood,
  deleteFood,
  placeOrder,
} = require("../controller/Food");

router.post("/createfood", checkforauth, createFood);
router.get("/getallfoods", checkforauth, getAllFoods);
router.get("/food/:id", checkforauth, getFoodById);
router.get("/foodByResturant/:id", checkforauth, getFoodByResturant);
router.put("/updatefood/:id", checkforauth, updateFood);
router.delete("/deletefood/:id", checkforauth, deleteFood);
router.post("/placeorder", checkforauth, placeOrder);

module.exports = router;
