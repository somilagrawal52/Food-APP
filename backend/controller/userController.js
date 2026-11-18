//GET User Info
const User = require("../models/user");

const getUserController = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateUserController = async (req, res) => {
  try {
    // Non-admin can only update their own profile (prevent IDOR)
    let id = req.user && req.user._id;
    if (req.user?.userType === "admin" && req.body.id) {
      id = req.body.id;
    }

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "No user id provided" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // Update user fields
    const { Username, phoneNumber, address } = req.body;
    if (Username) user.Username = Username;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating user",
      error: error.message || error,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email || !answer || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in resetting password",
      error: error.message || error,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    try {
      await User.matchpassword(user.email, oldPassword);
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: "Current password does not match",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating password",
      error: error.message || error,
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user?._id?.toString();
    const isAdmin = req.user?.userType === "admin";

    // Prevent unauthorized deletion (IDOR check)
    if (!isAdmin && currentUserId !== targetId) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized: You can only delete your own profile",
      });
    }

    const deleted = await User.findByIdAndDelete(targetId);
    if (!deleted) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting profile",
      error: error.message || error,
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Error in fetching users" });
  }
};


const updateUserRole = async (req, res) => {
  try {
    const { userId, userType } = req.body;
    const user = await User.findByIdAndUpdate(userId, { userType }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User role updated", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ success: false, message: "Error in updating user role" });
  }
};

module.exports = { 
  getUserController, 
  updateUserController, 
  resetPassword, 
  updatePassword, 
  deleteProfile,
  getAllUsers,
  updateUserRole
};
