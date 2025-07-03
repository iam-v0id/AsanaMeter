const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/yogaGameDB"
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", require("./routes/leaderboard"));

// Add a route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Yoga Game API!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
