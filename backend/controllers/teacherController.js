const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Get Assigned Class + Students
exports.getAssignedClass = async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id }).populate({
    path: 'classAssigned',
    populate: { path: 'students' }
  });

  if (!teacher || !teacher.classAssigned) {
    return res.status(404).json({ message: 'No class assigned' });
  }

  res.json({
    className: teacher.classAssigned.name,
    students: teacher.classAssigned.students
  });
};

// Check if Attendance Already Submitted Today
exports.checkTodayAttendance = async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id }).populate('classAssigned');
  const today = new Date().toISOString().split('T')[0];

  const existing = await Attendance.findOne({
    classId: teacher.classAssigned._id,
    date: today
  });

  res.json({ submitted: !!existing });
};

// Submit Attendance
exports.submitAttendance = async (req, res) => {
  const { records } = req.body; // array of { studentId, status }

  const teacher = await Teacher.findOne({ user: req.user._id }).populate('classAssigned');
  const today = new Date().toISOString().split('T')[0];

  // Prevent multiple submissions
  const alreadySubmitted = await Attendance.findOne({
    classId: teacher.classAssigned._id,
    date: today
  });

  if (alreadySubmitted) {
    return res.status(400).json({ message: 'Attendance already submitted today' });
  }

  const attendanceRecords = await Promise.all(records.map(async ({ studentId, status }) => {
    return await new Attendance({
      student: studentId,
      classId: teacher.classAssigned._id,
      teacher: teacher._id,
      date: today,
      status
    }).save();
  }));

  res.status(201).json({ message: 'Attendance submitted', count: attendanceRecords.length });
};

// View Past Attendance (by teacher)
exports.getPastAttendance = async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id }).populate('classAssigned');
  const attendance = await Attendance.find({ classId: teacher.classAssigned._id })
    .populate('student')
    .sort({ date: -1 });

  res.json(attendance);
};
