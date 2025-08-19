import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

// Prevent multiple connections in dev
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const leaderboardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: false },
  pose: { type: String, required: false },
  time: { type: Number, required: true },
});

const Leaderboard =
  mongoose.models.Leaderboard ||
  mongoose.model("Leaderboard", leaderboardSchema);

export default async function handler(req, res) {
  if (req.method === "POST" && req.url.endsWith("/add-time")) {
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
      res.status(200).json({ message: "Time added/updated successfully!" });
    } catch (error) {
      console.error("Error saving time:", error);
      res.status(500).json({ message: "Server error: " + error.message });
    }
  } else if (req.method === "GET" && req.url.startsWith("/api/leaderboard")) {
    try {
      let pose = req.query.pose;
      const leaderboard = await Leaderboard.find({ pose: pose }).sort({
        time: -1,
      });
      if (leaderboard.length === 0) {
        return res
          .status(200)
          .json({ message: "No entries in the leaderboard yet." });
      }
      res.status(200).json(
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
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end("Method Not Allowed");
  }
}
