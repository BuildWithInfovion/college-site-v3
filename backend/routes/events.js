const express = require("express");
const multer = require("multer");
const Event = require("../models/Event");
const authenticateToken = require("../middleware/auth");
const cloudinary = require("../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "college-events",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
  },
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
      // Cloudinary returns the URL in req.file.path
      const imageUrl = req.file.path;

      const newEvent = new Event({ title, imageUrl, date });
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (err) {
      console.error("Error saving event:", err);
      res.status(500).json({ error: "Server error saving event" });
    }
  }
);

// Protected DELETE route for deleting an event
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Optional: Add Cloudinary image deletion here if required

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Server error deleting event" });
  }
});

module.exports = router;
