const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: false },
  pose: { type: String, required: false },
  time: { type: Number, required: true },
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
