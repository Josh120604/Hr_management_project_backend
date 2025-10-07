const express = require('express');
const router = express.Router();
const {
  getEmployeesCon,
  addEmpCon,
  deleteEmpCon,
  updateEmpCon ,
  getEmployeeModalDataCon
} = require("../controllers/usersCon.js");
router.get('/', getEmployeesCon);
router.post('/', addEmpCon);
router.delete('/:emp_id', deleteEmpCon);
router.put('/:emp_id', updateEmpCon);
router.get('/employee-modal-data/:emp_id', getEmployeeModalDataCon);
module.exports = router;