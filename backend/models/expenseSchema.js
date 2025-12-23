const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
