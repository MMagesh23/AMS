const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const TimeWindow = require('../models/TimeWindow');

// ✅ Get Assigned Class + Students
exports.getAssignedClass = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id }).populate('classAssigned');

    if (!teacher || !teacher.classAssigned) {
      return res.status(404).json({ message: 'No class assigned' });
    }

    const classData = await Class.findById(teacher.classAssigned._id)
      .populate({
        path: 'students',
        select: 'name grade parent phone place', // Include additional fields
      })
      .populate('teacher', 'name'); // Ensure teacher's name is populated

    res.json({
      className: classData.name,
      teacherName: teacher.name,
      students: classData.students,
    });
  } catch (error) {
    console.error('Error in getAssignedClass:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check Attendance Status
exports.checkAttendanceStatus = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id }).populate('classAssigned');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (!teacher.classAssigned) {
      return res.status(400).json({ message: 'No class assigned to teacher' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day

    const existingAttendance = await Attendance.findOne({
      classId: teacher.classAssigned._id,
      submittedBy: teacher._id,
      date: today,
    });

    if (existingAttendance) {
      return res.status(200).json({ submitted: true });
    }

    res.status(200).json({ submitted: false });
  } catch (err) {
    console.error('Error in checkAttendanceStatus:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Time window
exports.getTimeWindow = async (req, res) => {
  try {
    const timeWindow = await TimeWindow.findOne();
    if (!timeWindow) {
      return res.status(404).json({ message: 'Time window not set' });
    }
    res.status(200).json(timeWindow);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching time window', error: err.message });
  }
};

// ✅ Submit Attendance
exports.submitAttendance = async (req, res) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Invalid or missing records field' });
    }

    const teacher = await Teacher.findOne({ user: req.user.id }).populate('classAssigned');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (!teacher.classAssigned) {
      return res.status(400).json({ message: 'No class assigned to teacher' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day

    // Check if attendance has already been submitted for today
    const existingAttendance = await Attendance.findOne({
      classId: teacher.classAssigned._id,
      submittedBy: teacher._id,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance has already been submitted for today' });
    }

    // Save attendance records
    const attendanceRecords = await Promise.all(
      records.map(({ studentId, status }) =>
        new Attendance({
          student: studentId,
          classId: teacher.classAssigned._id,
          submittedBy: teacher._id,
          date: today,
          status,
        }).save()
      )
    );

    res.status(201).json({ message: 'Attendance submitted', count: attendanceRecords.length });
  } catch (err) {
    console.error('Error in submitAttendance:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ View Past Attendance (by teacher)
exports.getPastAttendance = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id }).populate('classAssigned');

    if (!teacher || !teacher.classAssigned) {
      return res.status(404).json({ message: 'No class assigned' });
    }

    const attendance = await Attendance.find({ classId: teacher.classAssigned._id })
      .populate('student', 'name grade') // Include student details
      .sort({ date: -1 }); // Sort by most recent first

    res.json(attendance);
  } catch (err) {
    console.error('Error in getPastAttendance:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
