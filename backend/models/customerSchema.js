const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNo: { type: String, required: true },
  city: { type: String, required: true },
  bills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }],
  totalTransactionAmount: { type: Number, default: 0 },
  totalDueAmount: { type: Number, default: 0 },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
