const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },

    driveFolderUrl: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

router.post("/", async (req, res) => {
  try {
    const { eventName, description, date, driveFolderUrl, createdBy } =
      req.body;

    const newEvent = new Event({
      eventName,
      description,
      date,
      driveFolderUrl,
      createdBy,
    });

    await newEvent.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Event created successfully!",
        data: newEvent,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
