const Resturant = require("../models/Resturant");

const createResturant = async (req, res) => {
  try {
    const {
      title,
      imageURL,
      foods,
      time,
      pickup,
      delivery,
      isOpen,
      logoURL,
      rating,
      ratingCount,
      code,
      coords,
    } = req.body;

    if (!title || !coords) {
      return res.status(500).send({
        success: false,
        message: "Title and coordinates are required",
      });
    }
    const newResturant = new Resturant({
      title,
      imageURL,
      foods,
      time,
      pickup,
      delivery,
      isOpen,
      logoURL,
      rating,
      ratingCount,
      code,
      coords,
    });
    await newResturant.save();
    res.status(201).send({
      success: true,
      message: "Resturant created successfully",
      resturant: newResturant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating resturant",
      error,
    });
  }
};

const getAllResturants = async (req, res) => {
  try {
    const resturants = await Resturant.find({});
    res.status(200).send({
      success: true,
      message: "Resturants fetched successfully",
      total: resturants.length,
      resturants,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching resturants",
      error,
    });
  }
};

const getResturantById = async (req, res) => {
  try {
    const resturantId = req.params.id;
    const resturant = await Resturant.findById(resturantId);
    if (!resturant) {
      return res.status(404).send({
        success: false,
        message: "Resturant not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Resturant fetched successfully",
      resturant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching resturant by id",
      error,
    });
  }
};

const deleteResturant = async (req, res) => {
  try {
    await Resturant.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Resturant deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting resturant",
      error,
    });
  }
};

module.exports = {
  createResturant,
  getAllResturants,
  getResturantById,
  deleteResturant,
};
