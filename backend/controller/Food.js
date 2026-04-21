const Food = require("../models/Food");
const Order = require("../models/Order");
const Resturant = require("../models/Resturant");

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

    if (!title || !description || !price || !category || !Resturants) {
      return res.status(500).send({
        success: false,
        message: "All fields are required including Resturants",
      });
    }

    // Check if user owns this restaurant
    const resturant = await Resturant.findById(Resturants);
    if (!resturant) {
        return res.status(404).send({ success: false, message: "Resturant not found" });
    }
    if (resturant.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(401).send({ success: false, message: "Unauthorized to add food to this resturant" });
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
    const filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.resturant) {
      filters.Resturants = req.query.resturant;
    }
    if (req.query.search) {
      filters.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { foodtags: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const foods = await Food.find(filters).populate("Resturants");
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
    const food = await Food.findById(req.params.id).populate("Resturants");
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
    const foods = await Food.find({ Resturants: resturantId }).populate("Resturants");
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
    const food = await Food.findById(foodId).populate("Resturants");
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "Food not found",
      });
    }

    // Check ownership
    const resturant = food.Resturants;
    if (!resturant) {
        return res.status(404).send({ success: false, message: "Restaurant not found for this food" });
    }
    
    const ownerId = resturant.owner ? resturant.owner.toString() : null;
    if (!ownerId) {
        return res.status(500).send({ success: false, message: "Restaurant owner not found" });
    }

    if (ownerId !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(401).send({ success: false, message: "Unauthorized to update this food" });
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
      Resturants: newResturantId,
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
        Resturants: newResturantId || food.Resturants,
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
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "Food not found",
      });
    }

    // Check ownership
    const resturant = await Resturant.findById(food.Resturants);
    if (!resturant) {
        return res.status(404).send({ success: false, message: "Restaurant not found for this food" });
    }
    
    if (resturant.owner && resturant.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(401).send({ success: false, message: "Unauthorized to delete this food" });
    }

    await Food.findByIdAndDelete(foodId);
    res.status(200).send({
      success: true,
      message: "Food deleted successfully",
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
    const { cart, deliveryAddress } = req.body;
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Cart items are required",
      });
    }

    // For simplicity, we assume an order is for one restaurant at a time or we just take the first item's restaurant
    const firstItem = await Food.findById(cart[0]._id);
    if (!firstItem) return res.status(404).send({ success: false, message: "Food item not found" });

    const items = cart
      .filter((item) => item._id && item.price && item.quantity)
      .map((item) => ({
        food: item._id,
        title: item.title,
        imageURL: item.imageURL || "",
        price: Number(item.price),
        quantity: Number(item.quantity),
      }));

    if (items.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Valid cart items are required",
      });
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      items,
      payment: total,
      buyer: req.user._id,
      resturant: firstItem.Resturants,
      deliveryAddress: deliveryAddress || "",
    });

    await newOrder.save();
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("buyer", "Username email phoneNumber address")
      .populate("items.food");

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in placing order",
      error,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.food")
      .populate("resturant");

    res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching orders",
      error,
    });
  }
};

const getVendorOrders = async (req, res) => {
    try {
        const myResturants = await Resturant.find({ owner: req.user._id });
        const resturantIds = myResturants.map(r => r._id);
        
        const orders = await Order.find({ resturant: { $in: resturantIds } })
            .sort({ createdAt: -1 })
            .populate("buyer", "Username email phoneNumber")
            .populate("items.food")
            .populate("resturant");

        res.status(200).send({
            success: true,
            message: "Vendor orders fetched successfully",
            orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching vendor orders",
            error,
        });
    }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("buyer", "Username email phoneNumber")
      .populate("items.food")
      .populate("resturant");

    res.status(200).send({
      success: true,
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching all orders",
      error,
    });
  }
};

const changeOrderStatus = async (req, res) => {
  try {
    const {status} = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send({ success: false, message: "Order not found" });

    // Check ownership if vendor
    if (req.user.userType === 'vendor') {
        const resturant = await Resturant.findById(order.resturant);
        if (resturant.owner.toString() !== req.user._id.toString()) {
            return res.status(401).send({ success: false, message: "Unauthorized to change status of this order" });
        }
    }

    order.status = status;
    await order.save();
    
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
  getMyOrders,
  getVendorOrders,
  getAllOrders,
  changeOrderStatus,
};
