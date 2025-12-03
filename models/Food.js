const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const foodSchema = new mongoose.Schema(
  {
    title:{
        type: String,
        required: [true, "Title is required"],
    },
    description:{
        type: String,
        required: [true, "Description is required"],
    },
    price:{
        type: Number,
        required: [true, "Price is required"],
    },
    imageURL:{
        type: String,
    },
    foodtags:{
        type: String,
    },
    category:{
        type: String,
    },
    code:{
        type: String,
    },
    isAvailable:{
        type: Boolean,
        default: true,
    },
    Resturants:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Resturant",
    },
    rating:{
        type: Number,
        default: 5,
        min:1,
        max:5,
    },
    ratingCount:{
        type:String,
    }
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;