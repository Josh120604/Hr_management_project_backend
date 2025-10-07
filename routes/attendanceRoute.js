// routes/attendanceRoutes.js
const express = require('express');
const { EmployeeGet } = require('../controllers/attendanceCont.js'); // Adjust path if your controllers folder is named differently
const { getAttendanceRecords } = require('../controllers/attendanceCont.js');
const router = express.Router();

router.get('/attendance', EmployeeGet);
router.get('/attendancedate', getAttendanceRecords);

module.exports = router;