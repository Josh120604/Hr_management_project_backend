const { pool } = require("../config/db.js");

// READ
exports.getDepartmentById = async (department_id) => {
    try {
        const result = await pool.query('SELECT * FROM department WHERE department_id = ?', [department_id]);
        const rows = result && result[0] ? result[0] : result;
        return rows && rows[0] ? rows[0] : null;
    } catch (e) {
        console.error('Error fetching department: ', e);
        throw e;
    }
};
