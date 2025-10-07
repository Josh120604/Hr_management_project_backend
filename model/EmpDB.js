// Change import to require
const { pool } = require("../config/db.js"); // Keep .js if it's explicitly named, otherwise can remove

// Export functions using module.exports
// Define the functions as const variables first
const getEmployees = async () => {
    try {
        let [rows] = await pool.query('SELECT * FROM EmployeeData;');
        return rows;
    } catch (error) {
        throw error;
    }
};

// function getRandomNumber(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

const addEmp = async (employeeData) => {
    try {
        await pool.query(
            `INSERT INTO employeedata (emp_id, name, department_id, position, reviewer_emp_id)
             VALUES (?, ?, ?, ?, ?)`,
            [
                employeeData.emp_id,
                employeeData.name,
                employeeData.department_id || null,
                employeeData.position,
                employeeData.reviewer_emp_id || "EMP-701"
            ]
        );
        return { success: true };
    } catch (error) {
        console.error("Database error:", error);
        throw error;
    }
};

const deleteEmp = async (emp_id) => {
    try {
        await pool.query('DELETE FROM employeedata WHERE emp_id = ?', [emp_id]);
        return { success: true };
    } catch (error) {
        throw error;
    }
};

const updateEmp = async (emp_id, employeeData) => {
    try {
        await pool.query(
            `UPDATE employeedata
             SET name = ?, department_id = ?, position = ?, reviewer_emp_id = ?
             WHERE emp_id = ?`,
            [
                employeeData.name,
                employeeData.department_id || null,
                employeeData.position,
                employeeData.reviewer_emp_id || "EMP-701",
                emp_id
            ]
        );
        return { success: true };
    } catch (error) {
        console.error("Database error:", error);
        throw error;
    }
};

// Export all functions at the end using module.exports
module.exports = {
    getEmployees,
    addEmp,
    deleteEmp,
    updateEmp
};