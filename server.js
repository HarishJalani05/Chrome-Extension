const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/time-tracker");

const timeSchema = new mongoose.Schema({
  site: String,
  timeSpent: Number,
  date: { type: Date, default: Date.now }
});

const TimeEntry = mongoose.model("TimeEntry", timeSchema);

app.post("/api/log", async (req, res) => {
  const { site, timeSpent } = req.body;
  await TimeEntry.create({ site, timeSpent });
  res.sendStatus(201);
});

app.get("/api/summary", async (req, res) => {
  const summary = await TimeEntry.aggregate([
    { $group: { _id: "$site", totalTime: { $sum: "$timeSpent" } } }
  ]);
  res.json(summary);
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});