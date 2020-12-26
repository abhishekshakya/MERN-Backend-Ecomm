const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offer: Number,
  description: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("items", itemSchema);
