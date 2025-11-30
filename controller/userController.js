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
    const id = req.body.id || (req.user && req.user._id);
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "No user id provided" });
    }

    const user = await User.findById(id); // pass id directly
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

    res.status(200).send({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating user",
      error,
    });
  }
};

const resetPassword=async (req,res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if(!email || !answer || !newPassword){
      return res.status(500).send({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const user = await User.findOne({ email, answer });
    if(!user){
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
      error,
    });
  }
}

const updatePassword=async (req,res) => {
  try {
    const user=await User.findById(req.user._id);

    if(!user){
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword){
      return res.status(500).send({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const isMatch = await user.matchpassword(user.email, oldPassword);

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
      error,
    });
  }
}

const deleteProfile=async (req,res) => {
   try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Profile deleted successfully",
    });
   } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting profile",
      error,
    });
   }
}
module.exports = { getUserController, updateUserController, resetPassword, updatePassword, deleteProfile };