const express = require("express");
const router = express.Router();
const Leaderboard = require("../models/Leaderboard");

// Add or update a user's time for a specific pose
router.post("/add-time", async (req, res) => {
  const { userId, name, age, pose, time } = req.body;
  try {
    let existingUser = await Leaderboard.findOne({ userId, pose });
    if (existingUser) {
      if (time > existingUser.time) {
        existingUser.time = time;
        existingUser.name = name;
        existingUser.age = age;
        await existingUser.save();
      }
    } else {
      const newEntry = new Leaderboard({ userId, name, age, pose, time });
      await newEntry.save();
    }
    res.json({ message: "Time added/updated successfully!" });
  } catch (error) {
    console.error("Error saving time:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Get the leaderboard sorted by best time (longest time descending)
router.get("/leaderboard", async (req, res) => {
  try {
    let pose = req.query.pose;
    const leaderboard = await Leaderboard.find({ pose: pose }).sort({
      time: -1,
    });
    if (leaderboard.length === 0) {
      return res.json({ message: "No entries in the leaderboard yet." });
    }
    res.json(
      leaderboard.map((entry, index) => ({
        position: index + 1,
        name: entry.name,
        time: `${entry.time} seconds`,
      }))
    );
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;
