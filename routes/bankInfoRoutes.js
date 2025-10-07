const express = require('express');
const router = express.Router();
const bankInfoController = require('../controllers/bankInfoController');

router.get('/:emp_id', bankInfoController.getBankInfoById);
router.post('/', bankInfoController.createBankInfo);
router.put('/:emp_id', bankInfoController.updateBankInfo);
router.delete('/:emp_id', bankInfoController.deleteBankInfo);

module.exports = router