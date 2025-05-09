const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const teacherController = require('../controllers/teacherController');

// ✅ This applies middleware to all routes below
router.use(auth); 
router.use(checkRole('teacher'));

router.get('/time-window', teacherController.getTimeWindow);

// ✅ Routes
router.get('/assigned-class', teacherController.getAssignedClass);
router.get('/check-attendance-status', teacherController.checkAttendanceStatus);
router.post('/submit-attendance', teacherController.submitAttendance);
router.get('/past-attendance', teacherController.getPastAttendance);

module.exports = router;
