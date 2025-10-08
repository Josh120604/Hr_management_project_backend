// require dependencies
const express = require('express');
const dotenv = require('dotenv');
const attendanceRoutes = require('./routes/attendanceRoute.js');
const leaveRoutes = require('./routes/leaveRoute.js');
const employeeRoutes = require('./routes/EmpRoute.js')
const cors = require('cors');
dotenv.config(); // gives us access to config files NAMING IS IMPORTANT
const { testConnection } = require('./config/db');

// console.log(await getEmployees());
const app = express(); // making use of the data 
const PORT = process.env.PORT || 3000; // env imports

// Validate required env vars early. If using DATABASE_URL for Postgres we only require JWT_SECRET.
const usingDatabaseUrl = !!process.env.DATABASE_URL || process.env.DB_TYPE === 'postgres';
const baseRequired = ['JWT_SECRET'];
const fullRequired = usingDatabaseUrl ? baseRequired : baseRequired.concat(['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST']);
const missing = fullRequired.filter((k) => !process.env[k]);
if (missing.length) {
	console.error('Missing required env vars:', missing.join(', '));
	process.exit(1);
}

console.log(useDatabaseInfo());

function useDatabaseInfo() {
	if (process.env.DATABASE_URL) return `Using DATABASE_URL for DB connection`;
	if (process.env.DB_TYPE === 'postgres') return `Using Postgres via DB_* env vars`;
	return `Using MySQL via DB_* env vars`;
}

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const salaryRoutes = require('./routes/salaryRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const bankInfoRoutes = require('./routes/bankInfoRoutes');
const taxRoutes = require('./routes/taxInfoRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/', attendanceRoutes);
app.use('/leave', leaveRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/bankinfo', bankInfoRoutes);
app.use('/api/taxinfo', taxRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/Employees',employeeRoutes);

// Lightweight DB health check route (calls testConnection and returns status)
app.get('/db-check', async (req, res) => {
	try {
		await testConnection();
		return res.status(200).json({ ok: true, message: 'DB connection successful' });
	} catch (err) {
		return res.status(500).json({ ok: false, message: 'DB connection failed', error: err && err.message ? err.message : err });
	}
});

// Start the server only after DB connectivity check
testConnection()
	.then(() => {
		app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
	})
	.catch((err) => {
		console.error('Failed to start server due to DB error.');
		process.exit(1);
	});

// backend current flow: index -> routes -> controllers -> database link/ modal (mvc)