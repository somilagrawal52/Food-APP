const { validate } = require("../services/service");
const User = require("../models/user");

async function checkforadmin(req, res, next) {
  try {
    const user = await User.findById(req.body.id);
    if (user.userType !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Only admin can access this route",
      });
    }
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { checkforadmin };
