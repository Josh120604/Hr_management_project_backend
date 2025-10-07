const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

router.get('/', salaryController.getAllSalariesWithAllDetails);
router.get('/:emp_id/:effective_date', salaryController.getSalaryDetailsByIdAndDate);
router.post('/', salaryController.createSalary);
router.put('/:emp_id/:effective_date', salaryController.updateSalary);
router.delete('/:emp_id/:effective_date', salaryController.deleteSalary);

module.exports = router