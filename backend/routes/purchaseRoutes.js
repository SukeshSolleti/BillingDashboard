const express = require("express");
const router = express.Router();
const Purchase = require("../models/purchaseSchema");

// GET all purchases
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific purchase
router.get("/:id", getPurchase, (req, res) => {
  res.json(res.purchase);
});

// POST a new purchase
router.post("/", async (req, res) => {
  const purchase = new Purchase({
    description: req.body.description,
    price: req.body.price,
  });

  try {
    const newPurchase = await purchase.save();
    res.status(201).json(newPurchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH/update a purchase
router.patch("/:id", getPurchase, async (req, res) => {
  if (req.body.description != null) {
    res.purchase.description = req.body.description;
  }
  if (req.body.price != null) {
    res.purchase.price = req.body.price;
  }
  try {
    const updatedPurchase = await res.purchase.save();
    res.json(updatedPurchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update an existing purchase by ID
router.put("/:id", async (req, res) => {
  try {
    const { description, price, date } = req.body;

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { description, price, date },
      { new: true }
    );

    if (!updatedPurchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.json(updatedPurchase);
  } catch (error) {
    console.error("Error updating purchase:", error);
    res.status(500).json({ error: "Failed to update purchase" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const deletedPurchase = await Purchase.findByIdAndDelete(purchaseId);

    if (!deletedPurchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.json({ message: "Purchase deleted successfully", deletedPurchase });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({ error: "Failed to delete purchase" });
  }
});

async function getPurchase(req, res, next) {
  let purchase;
  try {
    purchase = await Purchase.findById(req.params.id);
    if (purchase == null) {
      return res.status(404).json({ message: "Cannot find purchase" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.purchase = purchase;
  next();
}

module.exports = router;
