const Category = require("../models/Category");

const createcategory = async (req, res) => {
  try {
    const { title, imageURL } = req.body;

    if (!title || !imageURL) {
      return res.status(500).send({
        success: false,
        message: "Title and ImageURL are required",
      });
    }
    const newCategory = new Category({
      title,
      imageURL,
    });
    await newCategory.save();
    res.status(201).send({
      success: true,
      message: "Category created successfully",
      newCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating category",
      error,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).send({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching categories",
      error,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const Category = await Category.findById(req.params.id);
    if (!Category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      Category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching category by ID",
      error,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
      deletedCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting category",
      error,
    });
  }
};

const UpdateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { title, imageURL } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title, imageURL },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      updatedCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating category",
      error,
    });
  }
};

module.exports = {
  createcategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  UpdateCategory,
};
