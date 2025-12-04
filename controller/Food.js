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

const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.status(200).send({
      success: true,
      message: "Foods fetched successfully",
      foods,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching foods",
      error,
    });
  }
};

const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "Food not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Food fetched successfully",
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching food",
      error,
    });
  }
};

const getFoodByResturant = async (req, res) => {
  try {
    const resturantId = req.params.id;
    const foods = await Food.find({ Resturants: resturantId });
    res.status(200).send({
      success: true,
      message: "Foods fetched successfully",
      foods,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching food by resturant",
      error,
    });
  }
};

const updateFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "Food not found",
      });
    }
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

    const updatedFood = await Food.findByIdAndUpdate(
      foodId,
      {
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
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Food updated successfully",
      updatedFood,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating food",
      error,
    });
  }
};

const deleteFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    const deletedFood = await Food.findByIdAndDelete(foodId);
    if (!deletedFood) {
      return res.status(404).send({
        success: false,
        message: "Food not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Food deleted successfully",
      deletedFood,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting food",
      error,
    });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { cart } = req.body;
    if (!cart) {
      return res.status(500).send({
        success: false,
        message: "Please provide all required fields",
      });
    }
    let total = 0;
    cart.map((item) => {
      total += item.price * item.quantity;
    });

    const newOrder = new Order({
      foods: cart,
      payment: total,
      buyer: req.user._id,
    });

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      newOrder,
    });

    await newOrder.save();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in placing order",
      error,
    });
  }
};

const changeOrderStatus = async (req, res) => {
  try {
    const {status} = req.body;
    const order=await Order.findByIdAndUpdate(
      req.params.id,
      {status},
      {new: true}
    );
    res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in changing order status",
      error,
    });
  }
}

module.exports = {
  createFood,
  getAllFoods,
  updateFood,
  getFoodById,
  getFoodByResturant,
  deleteFood,
  placeOrder,
};
