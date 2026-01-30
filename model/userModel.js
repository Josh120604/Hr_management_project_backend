const { pool } = require("../config/db.js");

exports.findUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const rows = result && result[0] ? result[0] : result;
    return rows && rows[0] ? rows[0] : null;
};

exports.findUserByEmpId = async (emp_id) => {
    const result = await pool.query('SELECT * FROM users WHERE emp_id = ?', [emp_id]);
    const rows = result && result[0] ? result[0] : result;
    return rows && rows[0] ? rows[0] : null;
};

exports.createUser = async (emp_id, username, passwordHash) => {
    const result = await pool.query(
        'INSERT INTO users (emp_id, username, password_hash) VALUES (?, ?, ?)',
        [emp_id, username, passwordHash]
    );
    if (result && result.insertId) return result.insertId;
    return null;
};
