const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  day: { type: Number}, // Map real dates to Day 1–10
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  status: { type: String, enum: ['present', 'absent'], required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }
});

attendanceSchema.index({ date: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
