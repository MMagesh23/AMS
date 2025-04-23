const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const moment = require('moment');

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
    const { name, grade, place, parent, phone } = req.body;
    const student = new Student({ name, grade, place, parent, phone });
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
    res.json(teachers);
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
    const { name, userID, password } = req.body;
    const existingUser = await User.findOne({ userID });
    if (existingUser) return res.status(400).json({ message: 'UserID already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({ userID, password: hashedPassword, role: 'teacher' }).save();

    const teacher = new Teacher({ name, user: user._id });
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
    const { name, userID, password } = req.body;

    // Find the teacher and associated user
    const teacher = await Teacher.findById(id).populate('user');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    // Update fields
    if (name) teacher.name = name;
    if (userID) teacher.user.userID = userID;
    if (password) {
      const hashedPassword = await sbcrypt.hash(password, 10);
      teacher.user.password = hashedPassword;
    }

    // Save the updated user and teacher
    await teacher.user.save();
    await teacher.save();

    res.json({ message: 'Teacher updated successfully', teacher });
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

// ------------------------- CLASS -------------------------

// Get All Classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find(); // Assuming Class is your Mongoose model
    res.json({ classes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch classes' });
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
    // 1. Find teacher and class
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // 2. If teacher is already assigned to a different class, unassign them
    if (teacher.classAssigned && teacher.classAssigned.toString() !== classId) {
      const previousClass = await Class.findById(teacher.classAssigned);
      if (previousClass) {
        previousClass.teacher = null;
        await previousClass.save();
      }
    }

    // 3. If class already has a different teacher, unassign that teacher
    if (classData.teacher && classData.teacher.toString() !== teacherId) {
      const previousTeacher = await Teacher.findById(classData.teacher);
      if (previousTeacher) {
        previousTeacher.classAssigned = null;
        await previousTeacher.save();
      }
    }

    // 4. Assign class to teacher and teacher to class
    teacher.classAssigned = classId;
    classData.teacher = teacherId;

    await teacher.save();
    await classData.save();

    return res.status(200).json({ message: 'Teacher successfully assigned to class (with reassignments handled)' });

  } catch (error) {
    console.error('Error assigning teacher:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Allocate Students to Class (bulk)
exports.allocateStudents = async (req, res) => {
  try {
    const {  studentIds } = req.body;
    const { id: classId } = req.params;

    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ message: 'Class not found' });

    let addedCount = 0;
    let skipped = [];

    for (const studentId of studentIds) {
      const student = await Student.findById(studentId);

      if (!student) {
        skipped.push({ studentId, reason: 'Student not found' });
        continue;
      }

      // Skip if category mismatch
      if (student.grade !== classData.category) {
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

// Get Attendance by Student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ student: studentId }).populate('student');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error });
  }
};

// Modify a Student’s Attendance (by Admin)
exports.modifyAttendance = async (req, res) => {
  try {
    const { attendanceId, status } = req.body;
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

    attendance.status = status;
    await attendance.save();

    res.json({ message: "Attendance updated", attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error modifying attendance', error });
  }
};

// Dashboard → Categories → Classes
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

// Dashboard → Class Detail View with Attendance for the Date Range
exports.getClassDetail = async (req, res) => {
  try {
    const { classId } = req.params;

    // Date range (April 28, 2025 to May 7, 2025)
    const startDate = moment('2025-04-28');
    const endDate = moment('2025-05-07');
    const dateRange = [];

    // Generate the date range
    for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
      dateRange.push(m.format('YYYY-MM-DD'));
    }

    // Fetch the class data along with its students and teacher
    const classData = await Class.findById(classId)
      .populate('teacher')
      .populate('students');

    if (!classData) return res.status(404).json({ message: "Class not found" });

    // Fetch attendance records for the students in the given date range
    const attendanceData = await Attendance.find({
      student: { $in: classData.students.map(s => s._id) },
      date: { $in: dateRange },
    });

    // Prepare the student attendance data
    const studentAttendance = classData.students.map(student => {
      const records = attendanceData.filter(a => a.student.toString() === student._id.toString());

      const attendanceByDate = dateRange.map(date => {
        const record = records.find(r => r.date === date);
        return {
          date,
          status: record ? record.status : null, // status can be "Present", "Absent", or null (if no record)
          _id: record ? record._id : null, // attendanceId for modification
        };
      });

      return {
        studentId: student._id,
        name: student.name,
        attendance: attendanceByDate,
      };
    });

    res.json({
      className: classData.name,
      teacher: classData.teacher ? classData.teacher.name : 'None',
      students: studentAttendance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class detail', error });
  }
};
