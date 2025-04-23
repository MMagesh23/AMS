const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: Number, required: true }, 
  category: { type: String, enum: ['Beginner', 'Primary', 'Junior', 'Inter'] },
  place: String,
  parent: String,
  phone: String,
  classAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
});

module.exports = mongoose.model('Student', studentSchema);
