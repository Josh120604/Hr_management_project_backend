// Database pool configuration with support for MySQL (mysql2) and PostgreSQL (pg).
// When using PostgreSQL on Render set DATABASE_URL to the provided connection string.
const dotenv = require('dotenv');
dotenv.config();

const isPostgres = !!(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) || process.env.DB_TYPE === 'postgres';

if (isPostgres) {
  // PostgreSQL path: use pg and provide a small adapter that converts ? placeholders to $1 $2 ...
  const { Pool } = require('pg');

  // Create pool. If DATABASE_URL present use it, otherwise build from DB_* vars
  // Add SSL options for environments like Render. You can control SSL explicitly via DB_SSL env var
  // DB_SSL=true|false (optional). If not set and DATABASE_URL contains "render" we default to
  // rejectUnauthorized: false which is required for some managed providers.
  const inferSsl = (() => {
    if (typeof process.env.DB_SSL !== 'undefined') {
      return { rejectUnauthorized: String(process.env.DB_SSL).toLowerCase() === 'true' };
    }
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render')) {
      return { rejectUnauthorized: false };
    }
    return undefined;
  })();

  const pgConfig = process.env.DATABASE_URL
    ? (inferSsl ? { connectionString: process.env.DATABASE_URL, ssl: inferSsl } : { connectionString: process.env.DATABASE_URL })
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ...(inferSsl ? { ssl: inferSsl } : {}),
      };

  const pgPool = new Pool(pgConfig);

  // Convert SQL with `?` to $1, $2, ... so existing code using ? placeholders continues working.
  function convertPlaceholders(sql) {
    let idx = 0;
    return sql.replace(/\?/g, () => {
      idx += 1;
      return `$${idx}`;
    });
  }

  async function query(sql, params = []) {
    const converted = convertPlaceholders(sql);
    return pgPool.query(converted, params);
  }

  async function testConnection() {
    const client = await pgPool.connect();
    try {
      await client.query('SELECT 1');
      console.log('Postgres connection established successfully.');
    } finally {
      client.release();
    }
  }

  module.exports = {
    // Keep an object with a query method so existing code `pool.query(...)` works.
    pool: { query },
    testConnection,
    _rawPool: pgPool,
  };
} else {
  // MySQL path (existing behavior)
  const mysql2 = require('mysql2/promise');

  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

  const pool = mysql2.createPool({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
  });

  async function testConnection() {
    try {
      const conn = await pool.getConnection();
      conn.release();
      console.log('MySQL connection established successfully.');
    } catch (err) {
      console.error('Database connection failed:', err && err.message ? err.message : err);
      throw err;
    }
  }

  module.exports = { pool, testConnection };
}