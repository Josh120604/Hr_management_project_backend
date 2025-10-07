const { pool } = require("../config/db.js");

exports.findUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

exports.findUserByEmpId = async (emp_id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE emp_id = ?', [emp_id]);
  return rows[0];
};

exports.createUser = async (emp_id, username, passwordHash) => {
  const [result] = await pool.query(
    'INSERT INTO users (emp_id, username, password_hash) VALUES (?, ?, ?)',
    [emp_id, username, passwordHash]
  );
  return result.insertId;
};