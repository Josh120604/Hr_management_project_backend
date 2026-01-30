// db.js
const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,              // e.g. Clever Cloud host
  user: process.env.DB_USER,              // DB username
  password: process.env.DB_PASSWORD,      // DB password
  database: process.env.DB_NAME,           // Database name
  port: process.env.DB_PORT
    ? Number(process.env.DB_PORT)
    : 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // IMPORTANT: prevents JS Date timezone issues
  dateStrings: true,
});

/**
 * Test DB connection on app startup
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connection established successfully');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    throw err;
  }
}

module.exports = {
  pool,
  testConnection,
};
