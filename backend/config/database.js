const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const connectDB = async () => {
  try {
    const url = process.env.database_url || "mongodb://localhost:27017/Food-APP";
    await mongoose.connect(url);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection notice:", err.message);
  }
};

module.exports = { connectDB };
