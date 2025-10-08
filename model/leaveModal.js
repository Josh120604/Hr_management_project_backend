const { pool } = require('../config/db.js');

const getLeaveRecords = async (emp_id = null) => {
    try {
        let sql = `
            SELECT
                LT.leave_id,
                LT.emp_id,
                ED.name AS EmployeeName,
                to_char(LT.leave_start::date, 'YYYY-MM-DD') AS leave_start,
                to_char(LT.leave_end::date, 'YYYY-MM-DD') AS leave_end,
                LT.leave_reason,
                LT.leave_status
            FROM
                LeaveTable AS LT
            JOIN
                EmployeeData AS ED ON LT.emp_id = ED.emp_id
        `;
        const params = [];

        if (emp_id) {
            sql += ` WHERE LT.emp_id = ?`;
            params.push(emp_id);
        }

        sql += ` ORDER BY LT.leave_start DESC;`; 

    const result = await pool.query(sql, params);
    const rows = result && result.rows ? result.rows : (Array.isArray(result) ? result[0] : result);
    return rows;
    } catch (error) {
        console.error("Error in getLeaveRecords model:", error.message);
        throw new Error("Failed to retrieve leave records from the database.");
    }
};

const getPendingLeaveRecords = async () => {
    try {
        const sql = `
            SELECT
                LT.leave_id,
                LT.emp_id,
                ED.name AS EmployeeName,
                to_char(LT.leave_start::date, 'YYYY-MM-DD') AS leave_start,
                to_char(LT.leave_end::date, 'YYYY-MM-DD') AS leave_end,
                LT.leave_reason,
                LT.leave_status
            FROM
                LeaveTable AS LT
            JOIN
                EmployeeData AS ED ON LT.emp_id = ED.emp_id
            WHERE
                LT.leave_status = 'Pending'
            ORDER BY LT.leave_start ASC;
        `;
    const result = await pool.query(sql);
    const rows = result && result.rows ? result.rows : (Array.isArray(result) ? result[0] : result);
    return rows;
    } catch (error) {
        console.error("Error in getPendingLeaveRecords model:", error.message);
        throw new Error("Failed to retrieve pending leave records from the database.");
    }
};
const updateLeaveStatus = async (leave_id, new_status) => {
    try {
        // Basic validation for new_status
        if (!['Approved', 'Denied'].includes(new_status)) {
            throw new Error("Invalid leave status provided. Must be 'Approved' or 'Denied'.");
        }

        const sql = `
            UPDATE LeaveTable
            SET leave_status = ?
            WHERE leave_id = ?;
        `;
    const result = await pool.query(sql, [new_status, leave_id]);
    // Normalize affected rows info for mysql2/pg
    return result && result.rowCount !== undefined ? { affectedRows: result.rowCount } : (Array.isArray(result) && result[0] ? result[0] : result);
    } catch (error) {
        console.error("Error in updateLeaveStatus model:", error.message);
        throw new Error("Failed to update leave status in the database.");
    }
};

module.exports = {
    getLeaveRecords,
    getPendingLeaveRecords,
    updateLeaveStatus
}