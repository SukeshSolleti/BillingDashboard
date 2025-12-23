const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const paymentSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amountPaid: { type: Number, required: true },
});

const billSchema = new mongoose.Schema({
  items: [itemSchema],
  totalAmount: { type: Number, required: true },
  balanceAmount: { type: Number, required: true },
  payments: [paymentSchema],
  date: { type: Date, default: Date.now },
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
