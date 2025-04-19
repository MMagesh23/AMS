const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.use(auth, checkRole('admin')); // All routes below are admin-protected

// --- Student Routes ---
router.post('/students', adminController.addStudent);
router.put('/students/:id', adminController.editStudent);
router.delete('/students/:id', adminController.deleteStudent);

// --- Teacher Routes ---
router.post('/teachers', adminController.addTeacher);
router.put('/teachers/:id', adminController.editTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);


// --- Class Routes ---
router.post('/classes', adminController.createClass);
router.post('/classes/assign-teacher', adminController.assignTeacher);
router.post('/classes/allocate-students', adminController.allocateStudents);
router.post('/classes/remove-student', adminController.removeStudentFromClass);
router.post('/classes/remove-teacher', adminController.removeTeacherFromClass);


// --- Attendance & Dashboard ---
router.get('/attendance/:studentId', adminController.getStudentAttendance);
router.post('/attendance/modify', adminController.modifyAttendance);

router.get('/dashboard', adminController.getDashboardOverview);
router.get('/dashboard/class/:classId', adminController.getClassDetail);



module.exports = router;
