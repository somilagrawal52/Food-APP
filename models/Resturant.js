const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const resturantSchema = new mongoose.Schema(
  {
    title:{
        type: String,
        required: [true, "Title is required"],
    },
    imageURL:{
        type: String,
    },
    foods:{
        type: Array,
    },
    time:{
        type: String,
    },
    pickup:{
        type: Boolean,
        default:true,
    },
    delivery:{
        type: Boolean,
        default:true,
    },
    isOpen:{
        type: Boolean,
        default:true,
    },
    logoURL:{
        type: String,
    },
    rating:{
        type: Number,
        default: 0,
        min:0,
        max:5,
    },
    ratingCount:{
        type: String,
    },
    code:{
        type: String,
    },
    coords:{
        id:{type: String},
        lat:{type: Number},
        latDelta:{type: Number},
        lng:{type: Number},
        lngDelta:{type: Number},
        address:{type: String},
        title:{type: String},
    },
  },
  { timestamps: true }
);

resturantSchema.pre("save", async function (next) {
  const resturant = this;
  if (!resturant.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(resturant.password, salt);
  resturant.password = hashedPassword;
  next();
});

resturantSchema.statics.matchpassword = async function (email, password) {
  const resturant = await this.findOne({ email });
  if (!resturant) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, resturant.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }
  return resturant;
};

const Resturant = mongoose.model("Resturant", resturantSchema);

module.exports = Resturant;
