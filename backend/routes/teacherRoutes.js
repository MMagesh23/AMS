const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const teacherController = require('../controllers/teacherController');

router.use(auth, checkRole('teacher'));

router.get('/assigned-class', teacherController.getAssignedClass);
router.get('/check-today', teacherController.checkTodayAttendance);
router.post('/submit-attendance', teacherController.submitAttendance);
router.get('/past-attendance', teacherController.getPastAttendance);

module.exports = router;
