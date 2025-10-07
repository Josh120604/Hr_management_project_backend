const { pool } = require("../config/db.js");

// READ
exports.getBankInfoById = async (emp_id) => {
    try {
        const [rows] = await pool.query('SELECT bank_account_number, bank_name FROM EmployeeBankInfo WHERE emp_id = ?', [emp_id]);
        return rows[0];
    } catch (e) {
        console.error('Error fetching bank info: ', e);
        throw e;
    }
}

// CREATE
exports.createBankInfo = async (bankInfo) => {
    const {emp_id, bank_account_number, bank_name} = bankInfo;
    try {
        const [result] = await pool.query('INSERT INTO EmployeeBankInfo(bank_account_number, emp_id, bank_name) VALUES (?, ?, ?)', [bank_account_number, emp_id, bank_name]);
        if (result.affectedRows === 0) {
            throw new Error('Failed to create bank information');
        }
        return {message: 'Bank information created successfully'}
    } catch (e) {
        console.error('Error creating bank info: ', e);
        throw e;
    }
}

// UPDATE
exports.updateBankInfo = async (emp_id, bankInfoUpdate) => {
    const {bank_account_number, bank_name} = bankInfoUpdate;
    try {
        const [result] = await pool.query('UPDATE EmployeeBankInfo SET bank_account_number = ?, bank_name = ? WHERE emp_id = ?', [bank_account_number, bank_name, emp_id]);
        if (result.affectedRows === 0 ) {
            return {message: 'No bank information found or no changes made'};
        }
        return {message: 'Bank information updated successfully'}
    } catch (e) {
        console.error('Error updating bank info: ', e);
        throw e;
    }
}

// DELETE
exports.deleteBankInfo = async (emp_id) => {
    try {
        const [result] = await pool.query('DELETE FROM EmployeeBankInfo WHERE emp_id = ?', [emp_id]);
        if (result.affectedRows === 0 ) {
            return {message: 'No bank information found to delete'};
        }
        return {message: 'Bank information deleted successfully'}
    } catch (e) {
        console.error('Error deleting bank info: ', e);
        throw e;
    }
}