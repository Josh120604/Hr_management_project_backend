const Salary = require('../model/salaryModel');

exports.getAllSalariesWithAllDetails = async (req, res) => {
    try {
        const salaries = await Salary.getAllSalariesWithAllDetails();
        res.status(200).json(salaries);
    } catch (e) {
        console.error('Error in getAllSalariesWithAllDetails:', e);
        res.status(500).json({error: 'Failed to retrieve all salaries'});
    }
}

exports.getSalaryDetailsByIdAndDate = async (req, res) => {
    try {
        const {emp_id, effective_date} = req.params;
        const salary = await Salary.getSalaryDetailsByIdAndDate(emp_id, effective_date);

        if (!salary) {
            return res.status(404).json({message: 'Salary record not found'});
        };
        res.status(200).json(salary);
    } catch (e) {
        console.error('Error in getSalaryDetailsByIdAndDate:', e);
        res.status(500).json({error: 'Failed to retrieve salary record with details'});
    }
}

exports.createSalary = async (req,res) => {
    try {
        const newSalaryData = req.body;
        const result = await Salary.createSalary(newSalaryData);

        res.status(201).json({message: result.message});
    } catch (e) {
        console.error('Error in createSalary:', e);
        res.status(500).json({error: 'Failed to create salary record'});
    }
}

exports.updateSalary = async (req, res) => {
    try {
        const {emp_id, effective_date} = req.params;
        const updatedSalaryData = req.body;
        const result = await Salary.updateSalary(emp_id, effective_date, updatedSalaryData);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'No salary record found or no changes made'});
        }

        res.status(200).json({ message: result.message });
    } catch (e) {
        console.error('Error in updateSalary:', e);
        res.status(500).json({error: 'Failed to update salary record'});
    }
}

exports.deleteSalary = async (req, res) => {
    try {
        const {emp_id, effective_date} = req.params;
        const result = await Salary.deleteSalary(emp_id, effective_date);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'No salary record found to delete'});
        }

        res.status(200).json({ message: result.message });
    } catch (e) {
        console.error('Error in deleteSalary:', e);
        res.status(500).json({error: 'Failed to delete salary record'});
    }
}