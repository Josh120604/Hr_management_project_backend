const { pool } = require("../config/db.js");

// READ
exports.getTaxInfoById = async (emp_id) => {
    try {
        const [rows] = await pool.query('SELECT tax_code FROM EmployeeTax WHERE emp_id = ?', [emp_id]);
        return rows[0];
    } catch (e) {
        console.error('Error fetching tax info: ', e);
        throw e;
    }
}

// CREATE
exports.createTaxInfo = async (taxInfo) => {
    const {emp_id, tax_code} = taxInfo;
    try {
        const [result] = await pool.query('INSERT INTO EmployeeTax(emp_id, tax_code) VALUES (?, ?)', [emp_id, tax_code]);
        if (result.affectedRows === 0) {
            throw new Error('Failed to create tax information');
        }
        return {message: 'Tax information created successfully'}
    } catch (e) {
        console.error('Error creating tax info: ', e);
        throw e;
    }
}

// UPDATE
exports.updateTaxInfo = async (emp_id, taxInfoUpdate) => {
    const {tax_code} = taxInfoUpdate;
    try {
        const [result] = await pool.query('UPDATE EmployeeTax SET tax_code = ? WHERE emp_id = ?', [tax_code, emp_id]);
        if (result.affectedRows === 0 ) {
            return {message: 'No tax information found or no changes made'};
        }
        return {message: 'Tax information updated successfully'}
    } catch (e) {
        console.error('Error updating tax info: ', e);
        throw e;
    }
}

// DELETE
exports.deleteTaxInfo = async (emp_id) => {
    try {
        const [result] = await pool.query('DELETE FROM EmployeeTax WHERE emp_id = ?', [emp_id]);
        if (result.affectedRows === 0 ) {
            return {message: 'No tex information found to delete'};
        }
        return {message: 'Tax information deleted successfully'}
    } catch (e) {
        console.error('Error deleting tax info: ', e);
        throw e;
    }
}