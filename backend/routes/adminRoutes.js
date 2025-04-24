const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { Teacher } = require('../models/Teacher'); // Assuming you have a Teacher model
const { Student } = require('../models/Student'); // Assuming you have a Student model

router.use(auth, checkRole('admin')); // All routes below are admin-protected

// --- Student Routes ---
router.get('/students', adminController.getAllStudents);
router.get('/students/:id', adminController.getStudentById); 
router.post('/students', adminController.addStudent);
router.put('/students/:id', adminController.editStudent);
router.delete('/students/:id', adminController.deleteStudent);

// --- Teacher Routes ---
console.log(adminController.getAllTeachers); // Should log the function definition
router.get('/teachers', adminController.getAllTeachers);
router.get('/teachers/:id', adminController.getTeacherById);
router.post('/teachers', adminController.addTeacher);
router.put('/teachers/:id', adminController.editTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);


// --- Class Routes (RESTful) ---
router.get('/classes', adminController.getAllClasses);
router.get('/classes/:id', adminController.getClassById);
router.post('/classes', adminController.createClass);
router.post('/classes/assign-teacher', adminController.assignTeacher)
router.post('/classes/:id/allocate-students', adminController.allocateStudents);
router.patch('/classes/:id/remove-student', adminController.removeStudentFromClass);
router.patch('/classes/:id/remove-teacher', adminController.removeTeacherFromClass);
router.delete('/classes/:id', adminController.deleteClass);



// --- Attendance & Dashboard ---
// View attendance of a class by date
router.get('/class/:classId/date/:date', adminController.getClassAttendanceByDate);

// Add or update missed attendance
router.post('/add', adminController.addAttendance);

// Edit specific attendance
router.put('/update', adminController.updateAttendance);

// Get summary of attendance by date
router.get('/summary/:date', adminController.getDailySummary);

router.get('/attendance/overview', adminController.getAttendanceOverview);

router.get('/attendance/class/:classId/date/:date', adminController.getClassAttendanceByDate);

router.get('/dashboard', adminController.getDashboardOverview);
// router.get('/dashboard/class/:classId', adminController.getClassDetail);



module.exports = router;
