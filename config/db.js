// to show where database is linked 
const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config(); // gives us access to config files NAMING IS IMPORTANT
// these are required for connections

const pool = mysql2.createPool({ // this is the connection
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = {
    pool
};