const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const router = express.Router();

// Use a consistent secret key for signing JWT tokens here and in auth middleware
const JWT_SECRET = "myStrongSecretKeyThatMatchesAuthMiddleware"; // change this to a strong secret string

// POST /api/admin/login - authenticate admin and return JWT token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  try {
    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(401).json({ error: "Invalid username or password" });

    // Check password hash
    const validPassword = await admin.isValidPassword(password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid username or password" });

    // Create JWT payload
    const payload = { id: admin._id, username: admin.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;
