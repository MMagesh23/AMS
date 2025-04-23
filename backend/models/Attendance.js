const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
});

attendanceSchema.index({ date: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
