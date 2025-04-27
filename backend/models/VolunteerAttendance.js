const mongoose = require('mongoose');

const volunteerAttendanceSchema = new mongoose.Schema({
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
});

module.exports = mongoose.model('VolunteerAttendance', volunteerAttendanceSchema);