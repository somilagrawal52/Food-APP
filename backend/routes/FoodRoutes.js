const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const { checkforauth } = require("../middleware/authMiddleware");
const { checkforadmin } = require("../middleware/adminMiddleware");
const { checkforvendor } = require("../middleware/vendorMiddleware");
const {
  createFood,
  getAllFoods,
  getFoodById,
  getFoodByResturant,
  updateFood,
  deleteFood,
  placeOrder,
  changeOrderStatus,
  getMyOrders,
  getVendorOrders,
  getAllOrders,
} = require("../controller/Food");

router.post("/createfood", checkforauth, checkforvendor, createFood);
router.get("/getallfoods", getAllFoods);
router.get("/food/:id", getFoodById);
router.get("/foodByResturant/:id", getFoodByResturant);
router.put("/updatefood/:id", checkforauth, checkforvendor, updateFood);
router.delete("/deletefood/:id", checkforauth, checkforvendor, deleteFood);
router.post("/placeorder", checkforauth, placeOrder);
router.get("/orders/my", checkforauth, getMyOrders);
router.get("/orders/vendor", checkforauth, checkforvendor, getVendorOrders);
router.get("/orders/all", checkforauth, checkforadmin, getAllOrders);
router.post("/orderStatus/:id", checkforauth, checkforvendor, changeOrderStatus);

module.exports = router;
