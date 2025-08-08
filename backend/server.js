const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const adminAuthRouter = require("./routes/adminAuth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend static files from the frontend folder located one level up from backend
app.use(express.static(path.join(__dirname, "../frontend")));

// Admin auth routes
app.use("/api/admin", adminAuthRouter);

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection URI
const MONGO_URI =
  "mongodb+srv://admin:admin%402025@cluster0.qapk6t7.mongodb.net/collegeDB?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import modular routers from routes folder
const noticesRouter = require("./routes/notices");
const eventsRouter = require("./routes/events");

// Use routers for API routes
app.use("/api/notices", noticesRouter);
app.use("/api/events", eventsRouter);

// <<< Test static route (for confirming static file serving)
app.get("/test-static", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin-login.html"));
});

// Catch-all 404 handler — must be last
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
