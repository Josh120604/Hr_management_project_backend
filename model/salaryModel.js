const { pool } = require("../config/db.js");

// GET ALL | READ
exports.getAllSalariesWithAllDetails = async () => {
    try {
        const [rows] = await pool.query(
            `SELECT
                s.emp_id,
                emp.name,
                s.effective_date,
                s.department_id,
                s.hours_worked,
                s.deductions,
                s.base_salary,
                s.final_salary,
                d.hourly_rate,
                d.department_name
            FROM
                salary s
            JOIN 
                department d ON s.department_id = d.department_id
            JOIN 
                EmployeeData emp ON s.emp_id = emp.emp_id`
        );
        return rows;
    } catch (e) {
        console.error('Error fetching all salaries with all details: ', e);
        throw e;
    }
}

// GET BY ID | READ
exports.getSalaryDetailsByIdAndDate = async (emp_id, effective_date) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                s.*,
                emp.name,
                d.hourly_rate,
                d.department_name,
                b.bank_account_number,
                b.bank_name,
                t.tax_code
            FROM
                salary s
            JOIN 
                department d ON s.department_id = d.department_id
            JOIN 
                EmployeeData emp ON s.emp_id = emp.emp_id
            LEFT JOIN
                EmployeeBankInfo b ON s.emp_id = b.emp_id
            LEFT JOIN
                EmployeeTax t ON s.emp_id = t.emp_id
            WHERE
                s.emp_id = ? AND s.effective_date = ?`,
            [emp_id, effective_date]
        );
        return rows[0]; 
    } catch (e) {
        console.error('Error fetching salary record with details: ', e);
        throw e;
    }
}

// CREATE 
exports.createSalary = async (salary) => {
    const {emp_id, department_id, hours_worked, deductions} = salary;
    try {
        const [employeeRows] = await pool.query('SELECT emp_id FROM EmployeeData WHERE emp_id = ?', [emp_id]);
        if (employeeRows.length === 0) {
            throw new Error(`Employee with ID ${emp_id} not found`);
        }
        const [departmentRows] = await pool.query('SELECT hourly_rate FROM department WHERE department_id = ?', [department_id]);
        if (departmentRows.length === 0) {
            throw new Error(`Department with ID ${department_id} not found`);
        }
        const hourlyRate = departmentRows[0].hourly_rate;

        const calcBaseSalary = parseFloat((hours_worked * hourlyRate).toFixed(2));

        const calcFinalSalary = parseFloat((calcBaseSalary - deductions).toFixed(2));
        
        const [result] = await pool.query(
            `INSERT INTO salary(emp_id, effective_date, department_id, hours_worked, deductions, base_salary, final_salary)
            VALUES (?, LAST_DAY(CURDATE()), ?, ?, ?, ?, ?)`, [emp_id, department_id, hours_worked, deductions, calcBaseSalary, calcFinalSalary]
        );

        if (result.affectedRows === 0) {
            throw new Error('Failed to insert new salary');
        }

        console.log('Successfully created salary record');
        return {message: 'Salary record created successfully'};
    } catch (e) {
        console.error('Error creating salary record: ', e);
        throw e;
    }
}

// UPDATE | PUT
exports.updateSalary = async (emp_id, effective_date, salaryData) => {
    const {department_id, hours_worked, deductions, base_salary, final_salary} = salaryData;
    try {
        const [result] = await pool.query(
            'UPDATE salary SET department_id = ?, hours_worked = ?, deductions = ?, department = ?, base_salary = ?, final_salary = ? WHERE employee_id = ? AND effective_date = ?', [department_id, hours_worked, deductions, base_salary, final_salary, emp_id, effective_date]
        );

        if (result.affectedRows === 0) {
            return {message: 'No salary record found or no changes made'}
        }

        return {message: 'Salary record updated successfully'};
    } catch (e) {
        console.error('Error updating salary: ', e);
        throw e;
    }
}

// DELETE 
exports.deleteSalary = async (emp_id, effective_date) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM salary WHERE emp_id = ? AND effective_date = ?', [emp_id, effective_date]
        );

        if (result.affectedRows === 0) {
            return {message: 'No salary record found to delete'}
        }
        return {message: 'Salary record deleted successfully'};
    } catch (e) {
        console.error('Error deleting salary: ', e);
        throw e;
    }
}
