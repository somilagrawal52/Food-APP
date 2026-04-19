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

const { checkforadmin } = require("../middleware/adminMiddleware");

router.post("/createcategory", checkforauth, checkforadmin, createcategory);
router.get("/getallcategories", getAllCategories);
router.get("/category/:id", getCategoryById);
router.delete("/category/:id", checkforauth, checkforadmin, deleteCategory);
router.put("/category/:id", checkforauth, checkforadmin, UpdateCategory);

module.exports = router;
