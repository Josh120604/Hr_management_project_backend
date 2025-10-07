// require dependencies
const express = require('express');
const dotenv = require('dotenv');
const attendanceRoutes = require('./routes/attendanceRoute.js');
const leaveRoutes = require('./routes/leaveRoute.js');
const employeeRoutes = require('./routes/EmpRoute.js')
const cors = require('cors');
dotenv.config(); // gives us access to config files NAMING IS IMPORTANT

// console.log(await getEmployees());
const app = express(); // making use of the data 
const PORT = process.env.PORT; // env imports

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

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));

// backend current flow: index -> routes -> controllers -> database link/ modal (mvc)