const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },

    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    role: { type: String, required: true, enum: ["Admin", "Alumni"] },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

router.post("/", async (req, res) => {
  try {
    const { title, content, authorName, authorEmail, role } = req.body;
    const newAnnouncement = new Announcement({
      title,
      content,
      authorName,
      authorEmail,
      role,
    });
    await newAnnouncement.save();
    res.status(201).json({ success: true, data: newAnnouncement });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/author/:email", async (req, res) => {
  try {
    const announcements = await Announcement.find({
      authorEmail: req.params.email,
    }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: updatedAnnouncement });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Announcement deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
