const { pool } = require("../config/db.js");

// READ
exports.getTaxInfoById = async (emp_id) => {
    try {
        const result = await pool.query('SELECT tax_code FROM employeetax WHERE emp_id = ?', [emp_id]);
        const rows = result && result[0] ? result[0] : result;
        return rows && rows[0] ? rows[0] : null;
    } catch (e) {
        console.error('Error fetching tax info: ', e);
        throw e;
    }
};

// CREATE
exports.createTaxInfo = async (taxInfo) => {
    const { emp_id, tax_code } = taxInfo;
    try {
        const result = await pool.query('INSERT INTO employeetax(emp_id, tax_code) VALUES (?, ?)', [emp_id, tax_code]);
        const affected = result && result.affectedRows ? result.affectedRows : 0;
        if (affected === 0) {
            throw new Error('Failed to create tax information');
        }
        return { message: 'Tax information created successfully' };
    } catch (e) {
        console.error('Error creating tax info: ', e);
        throw e;
    }
};

// UPDATE
exports.updateTaxInfo = async (emp_id, taxInfoUpdate) => {
    const { tax_code } = taxInfoUpdate;
    try {
        const result = await pool.query('UPDATE employeetax SET tax_code = ? WHERE emp_id = ?', [tax_code, emp_id]);
        const affected = result && result.affectedRows ? result.affectedRows : 0;
        if (affected === 0) {
            return { message: 'No tax information found or no changes made' };
        }
        return { message: 'Tax information updated successfully' };
    } catch (e) {
        console.error('Error updating tax info: ', e);
        throw e;
    }
};

// DELETE
exports.deleteTaxInfo = async (emp_id) => {
    try {
        const result = await pool.query('DELETE FROM employeetax WHERE emp_id = ?', [emp_id]);
        const affected = result && result.affectedRows ? result.affectedRows : 0;
        if (affected === 0) {
            return { message: 'No tax information found to delete' };
        }
        return { message: 'Tax information deleted successfully' };
    } catch (e) {
        console.error('Error deleting tax info: ', e);
        throw e;
    }
};
