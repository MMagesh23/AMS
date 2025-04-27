const mongoose = require('mongoose');

const timeWindowSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // Format: "HH:mm"
  endTime: { type: String, required: true },   // Format: "HH:mm"
});

module.exports = mongoose.model('TimeWindow', timeWindowSchema);