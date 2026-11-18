const express = require("express");
const router = express.Router();
const { checkforauth } = require("../middleware/authMiddleware");
const { checkforadmin } = require("../middleware/adminMiddleware");
const {
  createcategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  UpdateCategory,
} = require("../controller/Category");

router.post("/createcategory", checkforauth, checkforadmin, createcategory);
router.get("/getallcategories", getAllCategories);
router.get("/category/:id", getCategoryById);
router.delete("/category/:id", checkforauth, checkforadmin, deleteCategory);
router.put("/category/:id", checkforauth, checkforadmin, UpdateCategory);

module.exports = router;
