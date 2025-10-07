const EmployeeTax = require('../model/taxInfoModel');

exports.getTaxInfoById = async (req, res) => {
    try {
        const {emp_id} = req.params;
        const taxInfo = await EmployeeTax.getTaxInfoById(emp_id);

        if(!taxInfo){
            return res.status(404).json({message: 'Tax information not found'});
        }
        res.status(200).json({taxInfo});
    } catch (e) {
        console.error('Error in getTaxInfoById: ', e);
        res.status(500).json({error: 'Failed to retrieve tax information'});
    }
}

exports.createTaxInfo = async (req, res) => {
    try {
        const newTaxInfo = req.body;
        const result = await EmployeeTax.createTaxInfo(newTaxInfo);

        res.status(201).json({message: result.message});
    } catch (e) {
        console.error('Error in createTaxInfo: ', e);
        res.status(500).json({error: 'Failed to create tax information'});
    }
}

exports.updateTaxInfo = async (req, res) => {
    try {
        const {emp_id} = req.params;
        const updatedTaxInfo = req.body;
        const result = await EmployeeTax.updateTaxInfo(emp_id, updatedTaxInfo);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: result.message});
        }
        res.status(200).json({message: result.message});
    } catch (e) {
        console.error('Error in updateTaxInfo: ', e);
        res.status(500).json({error: 'Failed to update tax information'});
    }
}

exports.deleteTaxInfo = async (req, res) => {
    try {
        const {emp_id} = req.params;
        const result = await EmployeeTax.deleteTaxInfo(emp_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: result.message});
        }
        res.status(200).json({message: result.message});
    } catch (e) {
        console.error('Error in deleteTaxInfo: ', e);
        res.status(500).json({error: 'Failed to delete tax information'});
    }
}