const EmployeeBankInfo = require('../model/bankInfoModel');

exports.getBankInfoById = async (req, res) => {
    try {
        const {emp_id} = req.params;
        const bankInfo = await EmployeeBankInfo.getBankInfoById(emp_id);

        if(!bankInfo){
            return res.status(404).json({message: 'Bank information not found'});
        }
        res.status(200).json({bankInfo});
    } catch (e) {
        console.error('Error in getBankInfoById: ', e);
        res.status(500).json({error: 'Failed to retrieve bank information'});
    }
}

exports.createBankInfo = async (req, res) => {
    try {
        const newBankInfo = req.body;
        const result = await EmployeeBankInfo.createBankInfo(newBankInfo);

        res.status(201).json({message: result.message});
    } catch (e) {
        console.error('Error in createBankInfo: ', e);
        res.status(500).json({error: 'Failed to create bank information or employee does not exist'});
    }
}

exports.updateBankInfo = async (req, res) => {
    try {
        const {emp_id} = req.params;
        const updatedBankInfo = req.body;
        const result = await EmployeeBankInfo.updateBankInfo(emp_id, updatedBankInfo);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: result.message});
        }
        res.status(200).json({message: result.message});
    } catch (e) {
        console.error('Error in updateBankInfo: ', e);
        res.status(500).json({error: 'Failed to update bank information'});
    }
}

exports.deleteBankInfo = async (req, res) => {
    try {
        const {emp_id} = req.params;
        const result = await EmployeeBankInfo.deleteBankInfo(emp_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: result.message});
        }
        res.status(200).json({message: result.message});
    } catch (e) {
        console.error('Error in deleteBankInfo: ', e);
        res.status(500).json({error: 'Failed to delete bank information'});
    }
}