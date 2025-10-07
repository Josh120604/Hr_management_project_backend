const { pool } = require("../config/db.js");

const getAttendance = async() => {
    try {
       let [row] = await pool.query(
        `
        SELECT
            ED.emp_id AS EmployeeID, -- Added emp_id here
            ED.name AS EmployeeName,
            DATE_FORMAT(A.attendance_date, '%Y-%m-%d') AS attendance_date,
            A.attendance_status,
            A.clocked_in_time,
            A.attendance_state
        FROM
            Attendance AS A
        INNER JOIN
            EmployeeData AS ED ON A.emp_id = ED.emp_id
        WHERE
            A.attendance_date = '2025-07-29';
        `)
       return row
    } catch (error) {
        return 'Tough luck'
    }
}

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
                Attendance AS A
            INNER JOIN
                EmployeeData AS ED ON A.emp_id = ED.emp_id
        `;

        const params = [];

        if (date !== null) {
            sql += `
                WHERE A.attendance_date = ?`; 
            params.push(date); 
        }

        const [rows, fields] = await pool.query(sql, params); 

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
