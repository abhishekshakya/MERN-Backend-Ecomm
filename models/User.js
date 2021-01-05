const mongoose = require("mongoose");

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
  address: {
    type: [String],
  },
});

module.exports = mongoose.model("Users", userSchema);
