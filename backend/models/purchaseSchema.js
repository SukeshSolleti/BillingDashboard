const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
module.exports = Purchase;
