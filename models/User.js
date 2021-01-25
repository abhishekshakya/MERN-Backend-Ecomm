const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    default: "Address",
  },
  add: {
    type: String,
    required: true,
  },
  user_default: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  wishList: {
    type: [String],
  },
  cart: {
    type: [String],
  },
  orders: {
    type: [String],
  },
  admin: {
    type: Boolean,
    default: false,
  },
  address: [addressSchema],
});

module.exports = {
  Users: mongoose.model("Users", userSchema),
  Address: mongoose.model("Address", addressSchema),
};
