const express = require("express");
const mongoose = require("mongoose");
const url = "mongodb://localhost/Business";
const app = express();

app.use(express.json());
mongoose.connect(url);
const con = mongoose.connection;

con.on("open", () => {
  console.log("Successfully connected to Mongodb");
});

app.use("/api", require("./routes/routes"));

app.listen(3000, "0.0.0.0", () => {
  console.log("Listening to port 3000");
});
