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

const Resturant = mongoose.model("Resturant", resturantSchema);

module.exports = Resturant;
