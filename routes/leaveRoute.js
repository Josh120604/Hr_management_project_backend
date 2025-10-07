// routes/leaveRoute.js
const express = require('express');
const router = express.Router();
const { getEmployeeLeave, getPendingLeaves, updateLeave } = require('../controllers/leaveCont.js');

// GET /leave - Fetches all leave records, or filters by emp_id if query param 'emp_id' is provided
router.get('/', getEmployeeLeave);

// GET /leave/pending - Fetches only pending leave records
router.get('/pending', getPendingLeaves);

// PUT /leave/update - Updates the status of a specific leave record
router.put('/update', updateLeave); // Using PUT for updates

module.exports = router;