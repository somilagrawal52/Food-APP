const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Payment: {
      type: String,
    },
    foods: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
    status: {
      type: String,
      enum: ["Pending", "Preparing", "On the way", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
