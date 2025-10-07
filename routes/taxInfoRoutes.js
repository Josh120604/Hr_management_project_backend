const express = require('express');
const router = express.Router();
const taxInfoController = require('../controllers/taxInfoController');

router.get('/:emp_id', taxInfoController.getTaxInfoById);
router.post('/', taxInfoController.createTaxInfo);
router.put('/:emp_id', taxInfoController.updateTaxInfo);
router.delete('/:emp_id', taxInfoController.deleteTaxInfo);

module.exports = router