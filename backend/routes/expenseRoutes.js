// expenseRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Import your authentication middleware
const Expense = require("../models/expenseSchema"); // Import Expense model

// POST - Create a new expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { description, price, date } = req.body;

    // Create new expense instance
    const newExpense = new Expense({
      description,
      price,
      date: date || Date.now(), // Use provided date or current date if not provided
    });

    // Save expense to database
    const savedExpense = await newExpense.save();

    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// GET - Retrieve all expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 }); // Sort by date descending

    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// GET - Retrieve a specific expense by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
});

// PUT - Update an existing expense by ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { description, price, date } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { description, price, date },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// DELETE - Delete a specific expense by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
