const mongoose = require('mongoose');

const teacherAttendanceSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
});

module.exports = mongoose.model('TeacherAttendance', teacherAttendanceSchema);