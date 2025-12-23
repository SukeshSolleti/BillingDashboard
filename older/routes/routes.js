const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  Expense,
  Purchase,
  Payment,
  Item,
  Stock,
  Bill,
  Customer,
} = require("../modules/schemas");

// Create a new customer
router.post("/customers", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create a new purchase
router.post("/purchases", async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();
    res.status(201).send(purchase);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create a new stock
router.post("/stocks", async (req, res) => {
  try {
    const stock = new Stock(req.body);
    await stock.save();
    res.status(201).send(stock);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create a new expense
router.post("/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).send(expense);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all customers
router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find().populate("bills");
    res.status(200).send(customers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all purchases
router.get("/purchases", async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.status(200).send(purchases);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all stocks
router.get("/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).send(stocks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all expenses
router.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).send(expenses);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add a bill to a customer
router.post("/customers/:customerId/bills", async (req, res) => {
  try {
    const { customerId } = req.params;
    const billData = req.body;

    // Create a new bill
    const bill = new Bill(billData);
    await bill.save();

    // Find the customer and update totalTransactionAmount and totalDueAmount
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).send({ error: "Customer not found" });
    }

    // Add the bill's totalAmount to the customer's totalTransactionAmount and totalDueAmount
    customer.totalTransactionAmount += bill.totalAmount;
    customer.totalDueAmount += bill.totalAmount;

    // Add the bill to the customer's bills array
    customer.bills.push(bill._id);

    // Save the updated customer
    await customer.save();

    res.status(201).send(bill);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Make a payment to a bill
router.post("/bills/:billId/payments", async (req, res) => {
  try {
    const { billId } = req.params;
    const { amountPaid } = req.body;

    // Find the bill
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).send({ error: "Bill not found" });
    }

    // Update balance amount of the bill
    bill.balanceAmount -= amountPaid;

    // Store payment in bill
    bill.payments.push({ date: new Date(), amountPaid });

    // Find the customer associated with the bill
    const customer = await Customer.findOne({ bills: billId });
    if (!customer) {
      return res.status(404).send({ error: "Customer not found" });
    }

    // Update totalDueAmount of the customer
    customer.totalDueAmount -= amountPaid;

    // Save changes
    await bill.save();
    await customer.save();

    res.status(200).send({ message: "Payment successful" });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
