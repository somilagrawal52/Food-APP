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
      owner: req.user._id,
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
    const filters = {};
    if (req.query.search) {
      filters.title = { $regex: req.query.search, $options: "i" };
    }
    const resturants = await Resturant.find(filters);
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

const getMyResturants = async (req, res) => {
  try {
    const resturants = await Resturant.find({ owner: req.user._id });
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
      message: "Error in fetching your resturants",
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

const updateResturant = async (req, res) => {
  try {
    const resturantId = req.params.id;
    const resturant = await Resturant.findById(resturantId);
    if (!resturant) {
      return res.status(404).send({
        success: false,
        message: "Resturant not found",
      });
    }
    // Only owner or admin can update
    if (resturant.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(401).send({
            success: false,
            message: "Unauthorized to update this resturant",
        });
    }

    const updatedResturant = await Resturant.findByIdAndUpdate(resturantId, req.body, { new: true });
    res.status(200).send({
      success: true,
      message: "Resturant updated successfully",
      resturant: updatedResturant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating resturant",
      error,
    });
  }
};

const deleteResturant = async (req, res) => {
  try {
    const resturant = await Resturant.findById(req.params.id);
    if (!resturant) {
        return res.status(404).send({
            success: false,
            message: "Resturant not found",
        });
    }
    // Only owner or admin can delete
    if (resturant.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(401).send({
            success: false,
            message: "Unauthorized to delete this resturant",
        });
    }

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
  getMyResturants,
  getResturantById,
  updateResturant,
  deleteResturant,
};
