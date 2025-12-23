const mongoose = require("mongoose");

// Define schema for expenses
const expensesSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  description: String,
  price: Number,
});

// Define schema for purchases
const purchaseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  description: String,
  price: Number,
});

// Define schema for payments
const paymentsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amountPaid: Number,
});

// Define schema for items
const itemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  price: { type: Number, default: 0 },
});

// Define schema for stocks
const stockSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
});

// Define schema for bills
const billSchema = new mongoose.Schema({
  items: [itemSchema],
  totalAmount: Number,
  balanceAmount: Number,
  payments: [paymentsSchema],
  date: { type: Date, default: Date.now },
});

// Define schema for customers
const customerSchema = new mongoose.Schema({
  name: String,
  phoneNo: String,
  city: String,
  bills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }],
  totalTransactionAmount: { type: Number, default: 0 },
  totalDueAmount: { type: Number, default: 0 },
});

// Create models
const Expense = mongoose.model("Expense", expensesSchema);
const Purchase = mongoose.model("Purchase", purchaseSchema);
const Payment = mongoose.model("Payment", paymentsSchema);
const Item = mongoose.model("Item", itemSchema);
const Stock = mongoose.model("Stock", stockSchema);
const Bill = mongoose.model("Bill", billSchema);
const Customer = mongoose.model("Customer", customerSchema);

module.exports = { Expense, Purchase, Payment, Item, Stock, Bill, Customer };
