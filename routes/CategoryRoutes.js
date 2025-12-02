const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { checkforauth } = require("../middleware/authMiddleware");
const {
  createcategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  UpdateCategory,
} = require("../controller/Category");

router.post("/createcategory", checkforauth, createcategory);
router.get("/getallcategories", checkforauth, getAllCategories);
router.get("/category/:id", checkforauth, getCategoryById);
router.delete("/category/:id", checkforauth, deleteCategory);
router.put("/category/:id", checkforauth, UpdateCategory);

module.exports = router;
