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

// Mark attendance for a teacher
router.post('/teachers/attendance', adminController.markTeacherAttendance);
// Get all teacher attendance records
router.get('/teachers/attendance', adminController.getTeacherAttendance);
// Delete a specific teacher attendance record
router.delete("/teachers/attendance/:id", adminController.deleteTeacherAttendance);


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
// router.post('/add', adminController.addAttendance);

// Edit specific attendance
router.put('/update', adminController.updateAttendance);

// Get summary of attendance by date
router.get('/summary/:date', adminController.getDailySummary);

router.get('/attendance/overview', adminController.getAttendanceOverview);
router.post('/attendance/add-or-update', adminController.addOrUpdateAttendance);
router.get('/attendance/class/:classId/date/:date', adminController.getClassAttendanceByDate);
router.delete("/attendance/:id", adminController.deleteAttendance);
//
router.get('/dashboard', adminController.getDashboardOverview);
// router.get('/dashboard/class/:classId', adminController.getClassDetail);

// Volunteer attendance routes
router.get('/volunteers/attendance', adminController.getVolunteerAttendance);
router.post('/volunteers/attendance', adminController.markVolunteerAttendance);
router.put('/volunteers/attendance/:id', adminController.editVolunteerAttendance);
router.delete('/volunteers/attendance/:id', adminController.deleteVolunteerAttendance);

// Volunteer CRUD routes
router.post('/volunteers', adminController.addVolunteer);
router.get('/volunteers', adminController.getVolunteers);
router.get('/volunteers/:id', adminController.getVolunteerById);
router.put('/volunteers/:id', adminController.editVolunteer);
router.delete('/volunteers/:id', adminController.deleteVolunteer);

router.get("/dashboard/analytics", adminController.getDashboardAnalytics);

// Set time window
router.post('/time-window', adminController.setTimeWindow); 
// Get time window
router.get('/time-window', adminController.getTimeWindow); 


module.exports = router;
