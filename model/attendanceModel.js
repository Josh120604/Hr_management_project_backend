const { pool } = require("../config/db.js");

const getAttendance = async () => {
    try {
        const result = await pool.query(
            `
            SELECT
                ED.emp_id AS EmployeeID,
                ED.name AS EmployeeName,
                DATE_FORMAT(A.attendance_date, '%Y-%m-%d') AS attendance_date,
                A.attendance_status,
                A.clocked_in_time,
                A.attendance_state
            FROM
                attendance AS A
            INNER JOIN
                employeeedata AS ED ON A.emp_id = ED.emp_id
            WHERE
                A.attendance_date = '2025-07-29';
            `
        );
        const rows = result && result[0] ? result[0] : result;
        return rows;
    } catch (error) {
        console.error("Error in getAttendance model function:", error);
        throw error;
    }
};

const getAttendanceByDate = async (date = null) => {
    try {
        let sql = `
            SELECT
                ED.emp_id AS EmployeeID,
                ED.name AS EmployeeName,
                DATE_FORMAT(A.attendance_date, '%Y-%m-%d') AS attendance_date,
                A.attendance_status,
                A.clocked_in_time,
                A.attendance_state
            FROM
                attendance AS A
            INNER JOIN
                employeeedata AS ED ON A.emp_id = ED.emp_id
        `;

        const params = [];

        if (date !== null) {
            sql += ` WHERE A.attendance_date = ?`;
            params.push(date);
        }

        const result = await pool.query(sql, params);
        const rows = result && result[0] ? result[0] : result;
        return rows;
    } catch (error) {
        console.error("Error in getAttendanceByDate model function:", error);
        throw error;
    }
};

module.exports = {
    getAttendance,
    getAttendanceByDate
};
