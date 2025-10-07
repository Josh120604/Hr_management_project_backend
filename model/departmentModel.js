const { pool } = require("../config/db.js");

// READ
exports.getDepartmentById = async (department_id) => {
    try {
        const [rows] = await pool.query('SELECT * FROM department WHERE department_id = ?', [department_id]);
        return rows[0];
    } catch (e) {
        console.error('Error fetching department: ', e);
        throw e;
    }
}