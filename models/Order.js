const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  item_id: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
    max: 2,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Orders", OrderSchema);
