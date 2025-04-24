const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

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

// ✅ Check if Attendance Already Submitted Today
exports.checkTodayAttendance = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id }).populate('classAssigned');

    if (!teacher || !teacher.classAssigned) {
      return res.status(404).json({ message: 'No class assigned' });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      classId: teacher.classAssigned._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    res.json({ submitted: !!existing });
  } catch (err) {
    console.error('Error in checkTodayAttendance:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Submit Attendance
exports.submitAttendance = async (req, res) => {
  try {
    const { records } = req.body;

    const teacher = await Teacher.findOne({ user: req.user.id }).populate('classAssigned');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (!teacher.classAssigned) {
      return res.status(400).json({ message: 'No class assigned to teacher' });
    }

    const now = new Date();

    // ✅ Check if the current time is within the allowed time window (10 AM to 1 PM)
    const startTime = new Date();
    startTime.setHours(10, 0, 0, 0); // 10:00 AM
    const endTime = new Date();
    endTime.setHours(13, 0, 0, 0); // 1:00 PM

    if (now < startTime || now > endTime) {
      return res.status(403).json({ message: 'Attendance can only be submitted between 10 AM and 1 PM' });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const alreadySubmitted = await Attendance.findOne({
      classId: teacher.classAssigned._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (alreadySubmitted) {
      return res.status(400).json({ message: 'Attendance already submitted today' });
    }

    const attendanceRecords = await Promise.all(
      records.map(({ studentId, status }) =>
        new Attendance({
          student: studentId,
          classId: teacher.classAssigned._id,
          submittedBy: teacher._id,
          date: now,
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
      .populate('student')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (err) {
    console.error('Error in getPastAttendance:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
