const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const TeacherAttendance = require('../models/TeacherAttendance');
const Volunteer = require('../models/Volunteer');
const VolunteerAttendance = require('../models/VolunteerAttendance');
const TimeWindow = require('../models/TimeWindow');

// ------------------------- STUDENT -------------------------

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ grade: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
};

// Get Student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error });
  }
};

// Add Student
exports.addStudent = async (req, res) => {
  try {
    const { name, grade, place, parent, phone, category	 } = req.body;
    const student = new Student({ name, grade, place, parent, phone ,category	});
    await student.save();
    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error });
  }
};

// Edit Student
exports.editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grade, place, parent, phone } = req.body;
    const student = await Student.findByIdAndUpdate(id, { name, grade, place, parent, phone }, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student updated', student });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
};

// ------------------------- TEACHER -------------------------

// Get All Teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('classAssigned', 'name');
    res.json(teachers); // Phone is automatically included
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error });
  }
};

// Get Teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).populate('user');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher', error });
  }
};

// Add Teacher
exports.addTeacher = async (req, res) => {
  try {
    const { name, phone, userID, password } = req.body; // Include phone
    const existingUser = await User.findOne({ userID });
    if (existingUser) return res.status(400).json({ message: 'UserID already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({ userID, password: hashedPassword, role: 'teacher' }).save();

    const teacher = new Teacher({ name, phone, user: user._id }); // Save phone
    await teacher.save();

    res.status(201).json({ message: 'Teacher created successfully', teacher });
  } catch (error) {
    res.status(500).json({ message: 'Error adding teacher', error });
  }
};

// Edit Teacher
exports.editTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, userid, password } = req.body; // Include phone

    // Find the teacher and associated user
    const teacher = await Teacher.findById(id).populate('user');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    // Update fields
    if (name) teacher.name = name;
    if (phone) teacher.phone = phone; // Update phone
    if (userid) teacher.user.userID = userid; // Update userID
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
      teacher.user.password = hashedPassword; // Update password
    }

    // Save the updated user and teacher
    await teacher.user.save();
    await teacher.save();

    // Return updated teacher with user details
    const updatedTeacher = await Teacher.findById(id).populate('user');
    res.json({ message: 'Teacher updated successfully', teacher: updatedTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Error updating teacher', error });
  }
};

// Delete Teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    await User.findByIdAndDelete(teacher.user);
    await Teacher.findByIdAndDelete(id);

    res.json({ message: 'Teacher and associated user deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error });
  }
};

const Class = require('../models/Class');


// Mark attendance for a teacher
exports.markTeacherAttendance = async (req, res) => {
  try {
    const { teacherId, date, status } = req.body;

    // Check if attendance already exists for the teacher on the given date
    const existingAttendance = await TeacherAttendance.findOne({ teacher: teacherId, date });
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this teacher on this date' });
    }

    const attendance = new TeacherAttendance({ teacher: teacherId, date, status });
    await attendance.save();

    res.status(201).json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error });
  }
};

// Get attendance records for all teachers
exports.getTeacherAttendance = async (req, res) => {
  try {
    const attendanceRecords = await TeacherAttendance.find()
      .populate('teacher', 'name')
      .sort({ date: -1 });
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records', error });
  }
};

// Delete Teacher Attendance
exports.deleteTeacherAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    await TeacherAttendance.findByIdAndDelete(id);
    res.status(200).json({ message: "Attendance record deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete attendance record.", error: err.message });
  }
};

// ------------------------- CLASS -------------------------

// Get All Classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher', 'name'); // Populate teacher's name
    res.json({ classes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch classes', error: err.message });
  }
};

// Get Class by ID
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await Class.findById(id).populate('teacher').populate('students');
    if (!classData) return res.status(404).json({ message: 'Class not found' });
    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class', error });
  }
}

// Create Class
exports.createClass = async (req, res) => {
  try {
    const { name, category } = req.body;
    const classExists = await Class.findOne({ name });
    if (classExists) return res.status(400).json({ message: 'Class name already exists' });

    const newClass = new Class({ name, category });
    await newClass.save();

    res.status(201).json({ message: 'Class created', class: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error });
  }
};

// Assign Teacher to Class
exports.assignTeacher = async (req, res) => {
  const { teacherId, classId } = req.body;

  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ message: 'Class not found' });

    // Handle reassignment logic
    if (teacher.classAssigned && teacher.classAssigned.toString() !== classId) {
      const previousClass = await Class.findById(teacher.classAssigned);
      if (previousClass) {
        previousClass.teacher = null;
        await previousClass.save();
      }
    }

    if (classData.teacher && classData.teacher.toString() !== teacherId) {
      const previousTeacher = await Teacher.findById(classData.teacher);
      if (previousTeacher) {
        previousTeacher.classAssigned = null;
        await previousTeacher.save();
      }
    }

    teacher.classAssigned = classId;
    classData.teacher = teacherId;

    await teacher.save();
    await classData.save();

    const updatedClass = await Class.findById(classId).populate('teacher', 'name'); // Populate teacher's name
    res.status(200).json({ message: 'Teacher successfully assigned', class: updatedClass });
  } catch (error) {
    console.error('Error assigning teacher:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Allocate Students to Class (bulk)
exports.allocateStudents = async (req, res) => {
  try {
    const {  studentIds } = req.body;
    const { id: classId } = req.params;

    const classData = await Class.findById(classId);
    console.log('Class category:', classData.category, typeof classData.category);

    if (!classData) return res.status(404).json({ message: 'Class not found' });

    let addedCount = 0;
    let skipped = [];

    for (const studentId of studentIds) {
      const student = await Student.findById(studentId);
      console.log('Student grade:', student?.grade, typeof student?.grade);

      if (!student) {
        skipped.push({ studentId, reason: 'Student not found' });
        continue;
      }

      // Skip if category mismatch
      // Skip if category mismatch
      if (student.category !== classData.category) {
        skipped.push({ studentId, name: student.name, reason: 'Category mismatch' });
        continue;
      }


      // Skip if already assigned to this class
      if (student.classAssigned?.toString() === classId) {
        skipped.push({ studentId, name: student.name, reason: 'Already assigned to this class' });
        continue;
      }

      // Remove student from previous class if needed
      if (student.classAssigned && student.classAssigned.toString() !== classId) {
        const oldClass = await Class.findById(student.classAssigned);
        if (oldClass) {
          oldClass.students = oldClass.students.filter(sid => sid.toString() !== student._id.toString());
          await oldClass.save();
        }
      }

      // Assign to new class
      student.classAssigned = classId;
      await student.save();

      // Avoid pushing duplicate student to class
      if (!classData.students.includes(student._id)) {
        classData.students.push(student._id);
        addedCount++;
      }
    }

    await classData.save();

    res.json({
      message: `${addedCount} students allocated`,
      skipped
    });

  } catch (error) {
    console.error('Allocation error:', error);
    res.status(500).json({ message: 'Error allocating students to class', error });
  }
};


// Remove a student from class
exports.removeStudentFromClass = async (req, res) => {
  try {
    const { studentId } = req.body;
    const { id: classId } = req.params;

    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ message: 'Class not found' });

    classData.students = classData.students.filter(sid => sid.toString() !== studentId);
    await classData.save();

    await Student.findByIdAndUpdate(studentId, { classAssigned: null });

    res.json({ message: 'Student removed from class' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing student from class', error });
  }
};


// Remove a teacher from class
exports.removeTeacherFromClass = async (req, res) => {
  try {
    const { classId } = req.body;

    const classData = await Class.findById(classId).populate('teacher');
    if (!classData) return res.status(404).json({ message: 'Class not found' });

    if (classData.teacher) {
      const teacher = await Teacher.findById(classData.teacher._id);
      teacher.classAssigned = null;
      await teacher.save();
    }

    classData.teacher = null;
    await classData.save();

    res.json({ message: 'Teacher removed from class' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing teacher from class', error });
  }
};

// Delete Class
exports.deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Class deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error deleting class' });
  }
};

const Attendance = require('../models/Attendance');

// 📌 View attendance for a class on a specific day
exports.getClassAttendanceByDate = async (req, res) => {
  const { classId, date } = req.params;
  try {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      classId,
      date: { $gte: start, $lte: end },
    }).populate('student');

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 📌 Add or Update Missed Attendance
exports.addOrUpdateAttendance = async (req, res) => {
  try {
    const { classId, date, records } = req.body;

    if (!classId || !date || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const attendanceDate = new Date(date);
    const today = new Date();
    if (attendanceDate > today) {
      return res.status(400).json({ message: 'Cannot add attendance for a future date' });
    }

    const inserted = await Promise.all(
      records.map(async ({ studentId, status }) => {
        return await Attendance.findOneAndUpdate(
          { student: studentId, classId, date: attendanceDate },
          {
            student: studentId,
            classId,
            date: attendanceDate,
            status,
          },
          { upsert: true, new: true } // Update if exists, otherwise create
        );
      })
    );

    res.status(200).json({ message: 'Attendance added/updated', count: inserted.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// 📌 Update a specific attendance record
// Update attendance status (toggle)
exports.updateAttendance = async (req, res) => {
  try {
    const { attendanceId, newStatus, studentId, classId, date } = req.body;
    let updated; 

    if (attendanceId) {
      updated = await Attendance.findByIdAndUpdate(
        attendanceId,
        { status: newStatus },
        { new: true }
      );
    } else {
      // Create new record if it doesn't exist
      updated = await Attendance.create({
        student: studentId,
        classId,
        date: new Date(date),
        status: newStatus,
      });
    }

    res.json({ message: 'Status updated', updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Delete attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    await Attendance.findByIdAndDelete(id);
    res.status(200).json({ message: "Attendance record deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete attendance record.", error: err.message });
  }
};

// 📌 Daily summary across all classes
exports.getDailySummary = async (req, res) => {
  const { date } = req.params;
  try {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const classes = await Class.find({});
    const summary = [];

    for (let cls of classes) {
      const students = await Student.find({ classAssigned: cls._id });
      const attendance = await Attendance.find({
        classId: cls._id,
        date: { $gte: start, $lte: end },
      });

      summary.push({
        classId: cls._id,
        className: cls.name,
        total: students.length,
        present: attendance.filter((a) => a.status === 'present').length,
        absent: attendance.filter((a) => a.status === 'absent').length,
        submitted: attendance.length > 0,
      });
    }

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 📌 Attendance overview for 10 days per class
exports.getAttendanceOverview = async (req, res) => {
  try {
    const today = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 9);

    const classes = await Class.find().populate('students');
    const overview = [];

    for (const classObj of classes) {
      const classData = {
        className: classObj.name,
        category: classObj.category,
        totalStudents: classObj.students.length,
        days: []
      };

      for (let i = 0; i < 10; i++) {
        const day = new Date(today);
        day.setDate(day.getDate() - i);
        day.setHours(0, 0, 0, 0);
        const nextDay = new Date(day);
        nextDay.setHours(23, 59, 59, 999);

        const presentCount = await Attendance.countDocuments({
          classId: classObj._id,
          date: { $gte: day, $lte: nextDay },
          status: 'present'
        });

        classData.days.unshift({
          date: day,
          present: presentCount,
          percentage: classObj.students.length
            ? Math.round((presentCount / classObj.students.length) * 100)
            : 0,
        });
      }

      overview.push(classData);
    }

    res.json(overview);
  } catch (err) {
    console.error('Error in getAttendanceOverview:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get attendance list for a class on a specific day
exports.getClassAttendanceByDate = async (req, res) => {
  const { classId, date } = req.params;
  try {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const classData = await Class.findById(classId).populate('students');
    if (!classData) return res.status(404).json({ message: 'Class not found' });

    const records = await Attendance.find({
      classId,
      date: { $gte: start, $lte: end },
    });

    const studentAttendance = classData.students.map((student) => {
      const record = records.find(r => r.student.toString() === student._id.toString());
      return {
        studentId: student._id,
        name: student.name,
        status: record ? record.status : 'absent',  // default to 'absent' if no record
        attendanceId: record ? record._id : null,
      };
    });

    res.json({ className: classData.name, date, students: studentAttendance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// 📌 Dashboard Class-Categorized Overview
exports.getDashboardOverview = async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher');
    const grouped = {
      Beginner: [],
      Primary: [],
      Junior: [],
      Inter: []
    };

    classes.forEach(cls => {
      if (grouped[cls.category]) {
        grouped[cls.category].push({
          classId: cls._id,
          name: cls.name,
          teacher: cls.teacher ? cls.teacher.name : null
        });
      }
    });

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard overview', error });
  }
};


// Add a new volunteer
exports.addVolunteer = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const volunteer = new Volunteer({ name, phone });
    await volunteer.save();
    res.status(201).json({ message: 'Volunteer added successfully', volunteer });
  } catch (error) {
    res.status(500).json({ message: 'Error adding volunteer', error });
  }
};

// Get all volunteers
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteers', error });
  }
};

// Get a volunteer by ID
exports.getVolunteerById = async (req, res) => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteer', error });
  }
};

// Edit a volunteer
exports.editVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(id, { name, phone }, { new: true });
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json({ message: 'Volunteer updated successfully', volunteer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating volunteer', error });
  }
};

// Delete a volunteer
exports.deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findByIdAndDelete(id);
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting volunteer', error });
  }
};

// Mark attendance for a volunteer
exports.markVolunteerAttendance = async (req, res) => {
  try {
    const { volunteerId, date, status } = req.body;

    // Check if attendance already exists for the volunteer on the given date
    const existingAttendance = await VolunteerAttendance.findOne({ volunteer: volunteerId, date });
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this volunteer on this date' });
    }

    const attendance = new VolunteerAttendance({ volunteer: volunteerId, date, status });
    await attendance.save();

    res.status(201).json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error });
  }
};

// Get attendance records for all volunteers
exports.getVolunteerAttendance = async (req, res) => {
  try {
    const attendanceRecords = await VolunteerAttendance.find()
      .populate('volunteer', 'name')
      .sort({ date: -1 });

    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records', error });
  }
};

// Edit attendance for a volunteer
exports.editVolunteerAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const attendance = await VolunteerAttendance.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance updated successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance', error });
  }
};


// Delete attendance record
exports.deleteVolunteerAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await VolunteerAttendance.findByIdAndDelete(id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting attendance record', error });
  }
};

// Dashboard Analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalVolunteers = await Volunteer.countDocuments();

    // Get today's start and end times in local time
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of the next day

    console.log("Today (local):", today);
    console.log("Tomorrow (local):", tomorrow);

    const studentAttendance = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: "present",
    });
    const totalStudentAttendance = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    });

    const teacherAttendance = await TeacherAttendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: "present",
    });
    const totalTeacherAttendance = await TeacherAttendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    });

    const volunteerAttendance = await VolunteerAttendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: "present",
    });
    const totalVolunteerAttendance = await VolunteerAttendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    });

    res.json({
      totalStudents,
      totalTeachers,
      totalVolunteers,
      studentAttendance: {
        present: studentAttendance,
        total: totalStudentAttendance,
        percentage: totalStudentAttendance
          ? Math.round((studentAttendance / totalStudentAttendance) * 100)
          : 0,
      },
      teacherAttendance: {
        present: teacherAttendance,
        total: totalTeacherAttendance,
        percentage: totalTeacherAttendance
          ? Math.round((teacherAttendance / totalTeacherAttendance) * 100)
          : 0,
      },
      volunteerAttendance: {
        present: volunteerAttendance,
        total: totalVolunteerAttendance,
        percentage: totalVolunteerAttendance
          ? Math.round((volunteerAttendance / totalVolunteerAttendance) * 100)
          : 0,
      },
    });
  } catch (err) {
    console.error("Error fetching analytics data:", err);
    res.status(500).json({ message: "Error fetching analytics data", error: err.message });
  }
};

// Set Time Window
exports.setTimeWindow = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Start time and end time are required' });
    }

    // Update or create the time window
    const timeWindow = await TimeWindow.findOneAndUpdate(
      {},
      { startTime, endTime },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Time window updated successfully', timeWindow });
  } catch (err) {
    res.status(500).json({ message: 'Error setting time window', error: err.message });
  }
};

// Get Time Window
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
