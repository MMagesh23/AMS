const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: String, // e.g., Beginner A
  category: { type: String, enum: ['Beginner', 'Primary', 'Junior', 'Inter'] },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

module.exports = mongoose.model('Class', classSchema);
