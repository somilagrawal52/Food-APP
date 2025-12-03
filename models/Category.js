const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    imageURL: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Category;
