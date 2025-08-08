const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Event = require("../models/Event");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  // Move one folder up from routes to backend root, where uploads/ is located
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Public GET route for fetching all events (no auth required)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Server error fetching events" });
  }
});

// Protected POST route for uploading event images
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, date } = req.body;
      if (!title || !req.file) {
        return res
          .status(400)
          .json({ error: "Title and image file are required" });
      }
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
      const newEvent = new Event({ title, imageUrl, date });
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (err) {
      console.error("Error saving event:", err);
      res.status(500).json({ error: "Server error saving event" });
    }
  }
);

// Protected DELETE route for deleting an event and its image file
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.imageUrl) {
      const imageFilename = event.imageUrl.split("/uploads/")[1];
      const imagePath = path.join(__dirname, "..", "uploads", imageFilename);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Server error deleting event" });
  }
});

module.exports = router;
