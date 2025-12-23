const express = require("express");
const router = express.Router();
const { Customer, Bill } = require("../models");

// Create a new customer
router.post("/", async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).send(newCustomer);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Fetch all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().populate("bills");

    // Calculate total transaction amount and total due amount for each customer
    const customersWithAmounts = customers.map((customer) => {
      const totalTransactionAmount = customer.bills.reduce(
        (total, bill) => total + bill.totalAmount,
        0
      );
      const totalDueAmount = customer.bills.reduce(
        (total, bill) => total + bill.balanceAmount,
        0
      );

      return {
        _id: customer._id,
        name: customer.name,
        phoneNo: customer.phoneNo,
        city: customer.city,
        totalTransactionAmount,
        totalDueAmount,
        bills: customer.bills,
      };
    });

    res.status(200).send(customersWithAmounts);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Fetch a customer by ID
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate("bills");
    if (!customer) {
      return res.status(404).send();
    }

    // Calculate total transaction amount and total due amount for the customer
    const totalTransactionAmount = customer.bills.reduce(
      (total, bill) => total + bill.totalAmount,
      0
    );
    const totalDueAmount = customer.bills.reduce(
      (total, bill) => total + bill.balanceAmount,
      0
    );

    res.status(200).send({
      _id: customer._id,
      name: customer.name,
      phoneNo: customer.phoneNo,
      city: customer.city,
      totalTransactionAmount,
      totalDueAmount,
      bills: customer.bills,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a customer
router.patch("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return res.status(404).send();
    }
    res.status(200).send(customer);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a customer
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.status(200).send(customer);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new bill for a customer
router.post("/:id/bills", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send({ error: "Customer not found" });
    }

    const newBill = new Bill(req.body);
    customer.bills.push(newBill);
    await newBill.save();
    await customer.save();

    // Calculate total transaction amount for the customer
    const totalTransactionAmount = customer.bills.reduce(
      (total, bill) => total + (bill.totalAmount || 0),
      0
    );

    // Calculate total due amount for the customer
    const totalDueAmount = customer.bills.reduce(
      (total, bill) => total + (bill.balanceAmount || 0),
      0
    );

    // Ensure values are numbers
    if (isNaN(totalTransactionAmount) || isNaN(totalDueAmount)) {
      throw new Error("Calculation error: resulting in NaN");
    }

    // Update customer's totalTransactionAmount and totalDueAmount
    customer.totalTransactionAmount = totalTransactionAmount;
    customer.totalDueAmount = totalDueAmount;
    await customer.save();

    res.status(201).send({
      newBill,
      totalTransactionAmount,
      totalDueAmount,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Fetch bills for a specific customer
router.get("/:id/bills", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate("bills");
    if (!customer) {
      return res.status(404).send({ error: "Customer not found" });
    }
    res.status(200).send(customer.bills); // Assuming bills are stored in the customer document
  } catch (err) {
    console.error("Error fetching bills:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// POST endpoint to create a new payment for a bill
router.post("/:customerId/bills/:billId/payments", async (req, res) => {
  const { amountPaid } = req.body;
  const { customerId, billId } = req.params;

  try {
    // Ensure amountPaid is a valid number
    if (!Number.isFinite(amountPaid) || amountPaid <= 0) {
      return res.status(400).send({ error: "Invalid amount paid" });
    }

    // Find the bill by ID and update payment details
    const bill = await Bill.findById(billId);

    if (!bill) {
      return res.status(404).send({ error: "Bill not found" });
    }

    // Create a new payment using the Payment schema within Bill
    const newPayment = {
      amountPaid,
    };

    // Update bill details
    bill.payments.push(newPayment);
    bill.balanceAmount -= amountPaid;

    await bill.save();

    // Calculate total due amount for the customer
    const customer = await Customer.findById(customerId).populate("bills");
    if (!customer) {
      return res.status(404).send({ error: "Customer not found" });
    }

    const totalDueAmount = customer.bills.reduce(
      (total, bill) => total + bill.balanceAmount,
      0
    );

    // Update customer's totalDueAmount
    customer.totalDueAmount = totalDueAmount;
    await customer.save();

    // Send updated bill object along with total due amount in response
    res.status(201).send({
      bill,
      totalDueAmount,
    });
  } catch (error) {
    console.error("Error making payment:", error);
    res.status(500).send({ error: "Error making payment" });
  }
});

module.exports = router;
