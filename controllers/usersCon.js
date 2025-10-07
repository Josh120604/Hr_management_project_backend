// Change import to require
const { pool } = require("../config/db.js"); // Keep .js if it's explicitly named, otherwise can remove
const { getEmployees, deleteEmp, addEmp, updateEmp } = require("../model/EmpDB.js");

// Export functions using module.exports or exports.
// We'll collect all exports into an object for module.exports for clarity.

const getEmployeesCon = async (req, res) => {
    res.json(
        await getEmployees()
    );
};

const addEmpCon = async (req, res) => {
    try {
        const { emp_id, name, department_id, position, reviewer_emp_id } = req.body;
        await addEmp({
            emp_id,
            name,
            department_id: department_id || null,
            position,
            reviewer_emp_id: reviewer_emp_id || "EMP-701"
        });
        res.json({
            success: true,
            message: "Employee added!",
            employee: {
                emp_id,
                name,
                department_id,
                position,
                reviewer_emp_id
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to add employee",
            error: error.message
        });
    }
};

const deleteEmpCon = async (req, res) => {
    try {
        const { emp_id } = req.params;
        await deleteEmp(emp_id);
        res.json({ success: true, message: "Employee deleted" });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, message: "Failed to delete employee" });
    }
};

const updateEmpCon = async (req, res) => {
    try {
        const { emp_id } = req.params;
        const { name, department_id, position, reviewer_emp_id } = req.body;
        await updateEmp(emp_id, {
            name,
            department_id: department_id || null,
            position,
            reviewer_emp_id: reviewer_emp_id || "EMP-701"
        });
        res.json({
            success: true,
            message: "Employee updated!",
            employee: {
                emp_id,
                name,
                department_id,
                position,
                reviewer_emp_id
            }
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update employee",
            error: error.message
        });
    }
};

const getEmployeeModalDataCon = async (req, res) => {
    try {
        const { emp_id } = req.params;
        // 1. Basic employee info
        const [[employee]] = await pool.query(
            'SELECT * FROM EmployeeData WHERE emp_id = ?',
            [emp_id]
        );
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        // 2. Department info
        const [[department]] = await pool.query(
            'SELECT department_name FROM department WHERE department_id = ?',
            [employee.department_id]
        );
        // 3. Contact info
        const [[contact]] = await pool.query(
            'SELECT email, phone_number FROM Contact WHERE emp_id = ?',
            [emp_id]
        );
        // 4. Address
        const [[address]] = await pool.query(
            'SELECT street_address, city FROM Address WHERE emp_id = ?',
            [emp_id]
        );
        // 5. Latest salary
        const [[salary]] = await pool.query(
            `SELECT base_salary FROM Salary
            WHERE emp_id = ?
            ORDER BY effective_date DESC LIMIT 1`,
            [emp_id]
        );
        // 6. Latest review
        const [[latestReview]] = await pool.query(
            `SELECT review_text, rating, review_date FROM Reviews
            WHERE emp_id = ?
            ORDER BY review_date DESC LIMIT 1`,
            [emp_id]
        );
        // 7. Reviewer name (if exists)
        let reviewerName = '';
        if (employee.reviewer_emp_id) {
            const [[reviewer]] = await pool.query(
                'SELECT name FROM EmployeeData WHERE emp_id = ?',
                [employee.reviewer_emp_id]
            );
            reviewerName = reviewer?.name;
        }
        res.json({
            employee,
            department,
            contact: contact || {},
            address: address || {},
            salary: salary || { base_salary: 'N/A' },
            latestReview: latestReview || null,
            reviewerName
        });
    } catch (error) {
        console.error('Modal data error:', error);
        res.status(500).json({
            error: 'Failed to load employee details'
        });
    }
};

// Export all functions at the end using module.exports
module.exports = {
    getEmployeesCon,
    addEmpCon,
    deleteEmpCon,
    updateEmpCon,
    getEmployeeModalDataCon
};