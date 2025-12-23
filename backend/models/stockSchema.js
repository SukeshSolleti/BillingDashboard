const mongoose = require("mongoose");

const stockUpdateSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const stockSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  updates: [stockUpdateSchema],
});

const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;
