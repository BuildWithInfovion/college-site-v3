const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  date: String,
});

module.exports = mongoose.model("Event", eventSchema);
