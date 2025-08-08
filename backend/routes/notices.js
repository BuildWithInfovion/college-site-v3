const express = require("express");
const Notice = require("../models/Notice");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Protect all routes so only authorized admins can access
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    console.error("Error fetching notices:", err);
    res.status(500).json({ error: "Server error fetching notices" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { title, description, date } = req.body;

  if (!title || !description || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newNotice = new Notice({ title, description, date });
    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    console.error("Error saving notice:", err);
    res.status(500).json({ error: "Server error saving notice" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
    if (!deletedNotice) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting notice:", err);
    res.status(500).json({ error: "Server error deleting notice" });
  }
});

module.exports = router;
