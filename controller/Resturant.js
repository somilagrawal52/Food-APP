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

    if(!title || !coords){
        return res.status(500).send({
            success: false,
            message: "Title and coordinates are required",
        })
    }
    const newResturant=new Resturant({
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
    })
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

module.exports = { createResturant };
