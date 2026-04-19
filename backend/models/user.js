const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    Username: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    address: {
      type: Array,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    userType: {
      type: String,
      default: "client",
      required: [true, "User type is required"],
      enum: ["admin", "client", "vendor", "driver"],
    },
    profileImage: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvMW6w37175N4MJ72LItjcyEYiqBVRnwt-kq14pW4bh2xfRG-rvR-ylro&s",
    },
    answer:{
      type: String,
      required: [true, "Answer is required"],
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  next();
});

userSchema.statics.matchpassword = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
