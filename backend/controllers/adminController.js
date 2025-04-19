const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ------------------------- STUDENT -------------------------

// Add Student
exports.addStudent = async (req, res) => {
  const { name, grade, place, parent, phone } = req.body;

  const student = new Student({ name, grade, place, parent, phone });
  await student.save();

  res.status(201).json({ message: 'Student added successfully', student });
};

// Edit Student
exports.editStudent = async (req, res) => {
  const { id } = req.params;
  const { name, grade, place, parent, phone } = req.body;

  const student = await Student.findByIdAndUpdate(id, { name, grade, place, parent, phone }, { new: true });
  if (!student) return res.status(404).json({ message: 'Student not found' });

  res.json({ message: 'Student updated', student });
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  await Student.findByIdAndDelete(id);
  res.json({ message: 'Student deleted' });
};

// ------------------------- TEACHER -------------------------

// Add Teacher (with User credentials)
exports.addTeacher = async (req, res) => {
  const { name, userID, password } = req.body;

  const existingUser = await User.findOne({ userID });
  if (existingUser) return res.status(400).json({ message: 'UserID already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await new User({ userID, password: hashedPassword, role: 'teacher' }).save();

  const teacher = new Teacher({ name, user: user._id });
  await teacher.save();

  res.status(201).json({ message: 'Teacher created successfully', teacher });
};

// Edit Teacher
exports.editTeacher = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const teacher = await Teacher.findByIdAndUpdate(id, { name }, { new: true });
  if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

  res.json({ message: 'Teacher updated', teacher });
};

// Delete Teacher (remove from both Teacher & User)
exports.deleteTeacher = async (req, res) => {
  const { id } = req.params;

  const teacher = await Teacher.findById(id);
  if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

  await User.findByIdAndDelete(teacher.user);
  await Teacher.findByIdAndDelete(id);

  res.json({ message: 'Teacher and associated user deleted' });
};

const Class = require('../models/Class');

// ------------------------- CLASS -------------------------

// Create Class
exports.createClass = async (req, res) => {
  const { name, category } = req.body;
  const classExists = await Class.findOne({ name });
  if (classExists) return res.status(400).json({ message: 'Class name already exists' });

  const newClass = new Class({ name, category });
  await newClass.save();

  res.status(201).json({ message: 'Class created', class: newClass });
};

// Assign Teacher to Class
exports.assignTeacher = async (req, res) => {
  const { classId, teacherId } = req.body;

  const classData = await Class.findById(classId);
  if (!classData) return res.status(404).json({ message: 'Class not found' });

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

  // Remove current class from previous teacher (optional)
  if (teacher.classAssigned) {
    const oldClass = await Class.findById(teacher.classAssigned);
    if (oldClass) {
      oldClass.teacher = null;
      await oldClass.save();
    }
  }

  classData.teacher = teacher._id;
  teacher.classAssigned = classData._id;

  await classData.save();
  await teacher.save();

  res.json({ message: 'Teacher assigned to class' });
};

// Allocate Students to Class (bulk)
exports.allocateStudents = async (req, res) => {
  const { classId, studentIds } = req.body;

  const classData = await Class.findById(classId);
  if (!classData) return res.status(404).json({ message: 'Class not found' });

  const updatedStudents = await Promise.all(studentIds.map(async (id) => {
    const student = await Student.findById(id);
    if (student) {
      student.classAssigned = classData._id;
      await student.save();
      if (!classData.students.includes(id)) {
        classData.students.push(student._id);
      }
    }
  }));

  await classData.save();

  res.json({ message: 'Students allocated to class' });
};

// Remove a student from class
exports.removeStudentFromClass = async (req, res) => {
  const { classId, studentId } = req.body;

  const classData = await Class.findById(classId);
  if (!classData) return res.status(404).json({ message: 'Class not found' });

  classData.students = classData.students.filter(sid => sid.toString() !== studentId);
  await classData.save();

  await Student.findByIdAndUpdate(studentId, { classAssigned: null });

  res.json({ message: 'Student removed from class' });
};

// Remove a teacher from class
exports.removeTeacherFromClass = async (req, res) => {
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
};


const Attendance = require('../models/Attendance');

// Get Attendance by Student
exports.getStudentAttendance = async (req, res) => {
  const { studentId } = req.params;
  const attendance = await Attendance.find({ student: studentId }).populate('student');
  res.json(attendance);
};

// Modify a Student’s Attendance (by Admin)
exports.modifyAttendance = async (req, res) => {
  const { attendanceId, status } = req.body;
  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

  attendance.status = status;
  await attendance.save();

  res.json({ message: "Attendance updated", attendance });
};

// Dashboard → Categories → Classes
exports.getDashboardOverview = async (req, res) => {
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
};

// Dashboard → Class Detail View
exports.getClassDetail = async (req, res) => {
  const { classId } = req.params;
  const classData = await Class.findById(classId)
    .populate('teacher')
    .populate('students');

  if (!classData) return res.status(404).json({ message: "Class not found" });

  const attendanceData = await Attendance.find({
    student: { $in: classData.students.map(s => s._id) }
  });

  const studentAttendance = classData.students.map(student => {
    const records = attendanceData.filter(a => a.student.toString() === student._id.toString());
    const presentCount = records.filter(r => r.status === 'Present').length;
    const absentCount = records.filter(r => r.status === 'Absent').length;

    return {
      studentId: student._id,
      name: student.name,
      present: presentCount,
      absent: absentCount
    };
  });

  res.json({
    className: classData.name,
    teacher: classData.teacher ? classData.teacher.name : 'None',
    students: studentAttendance
  });
};
