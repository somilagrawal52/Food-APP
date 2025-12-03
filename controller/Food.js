const Food = require("../models/Food");

const createFood = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      foodtags,
      category,
      imageURL,
      code,
      isAvailable,
      Resturants,
      rating,
      ratingCount,
    } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(500).send({
        success: false,
        message: "All fields are required",
      });
    }
    const newFood = new Food({
      title,
      description,
      price,
      foodtags,
      category,
      imageURL,
      code,
      isAvailable,
      Resturants,
      rating,
      ratingCount,
    });
    await newFood.save();
    res.status(201).send({
      success: true,
      message: "Food created successfully",
      newFood,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating food",
      error,
    });
  }
};

module.exports = { createFood };
