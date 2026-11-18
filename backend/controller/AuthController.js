const User = require("../models/user");
const { createToken } = require("../services/service");

const registerController = async (req, res) => {
  try {
    const { Username, email, password, phone, address, answer } = req.body;

    if (!Username || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists with this email. Please login.",
      });
    }

    const newUser = await User.create({
      Username,
      email,
      password,
      phoneNumber: phone,
      address,
      answer,
    });
    const safeUser = newUser.toObject();
    delete safeUser.password;

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register callback",
      error: error.message || error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide email and password",
      });
    }

    let user;
    try {
      user = await User.matchpassword(email, password);
    } catch (err) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      user: safeUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login callback",
      error: error.message || error,
    });
  }
};
module.exports = { registerController, loginController };
