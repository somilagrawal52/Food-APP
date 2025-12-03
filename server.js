//config dotenv
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const CategoryRoutes = require("./routes/CategoryRoutes");
const resturantRoutes = require("./routes/resturantRoutes");
const FoodRoutes = require("./routes/FoodRoutes");
const { connectDB } = require("./config/database");
const authRoutes = require("./routes/AuthRoutes");

//DB connection
connectDB();

//rest object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/resturant", resturantRoutes);
app.use("/api/v1/category", CategoryRoutes);
app.use("/api/v1/food", FoodRoutes);

//route
app.get("/", (req, res) => {
  res.send("Hello World");
});

//port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
