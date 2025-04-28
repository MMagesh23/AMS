const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: Number,
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
