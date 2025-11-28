const User = require("../models/user");
const { createToken } = require("../services/service");
const registerController = async (req, res) => {
  try {
    const { Username, email, password, phone, address } = req.body;

    if (!Username || !email || !password || !phone || !address) {
      return res.status(500).send({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists please login",
      });
    }
    const newUser = await User.create({
      Username,
      email,
      password,
      phoneNumber: phone,
      address,
    });
    res.status(201).send({
      success: true,
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register callback",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const user = await User.matchpassword(email, password);
    const token = createToken(user);

    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login callback",
      error,
    });
  }
};
module.exports = { registerController, loginController };
