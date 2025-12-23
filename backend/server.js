const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const authMiddleware = require("./middleware/authMiddleware"); // Import your authentication middleware
const customerRoutes = require("./routes/customerRoutes"); // Import routes
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const {
  Expense,
  Purchase,
  Payment,
  Item,
  Stock,
  Bill,
  Customer,
} = require("./models");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/api/users", userRoutes);
app.use("/api/customers", authMiddleware, customerRoutes);
app.use("/api/expenses", authMiddleware, expenseRoutes);
app.use("/api/purchases", authMiddleware, purchaseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
