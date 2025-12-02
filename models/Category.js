const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const categorySchema = new mongoose.Schema(
  {
    title:{
        type: String,
        required: [true, "Title is required"],
    },
    imageURL:{
        type: String,
    },
  },
  { timestamps: true }
);

categorySchema.pre("save", async function (next) {
  const category = this;
  if (!category.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(category.password, salt);
  category.password = hashedPassword;
  next();
});

categorySchema.statics.matchpassword = async function (email, password) {
  const category = await this.findOne({ email });
  if (!category) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, category.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }
  return category;
};

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
