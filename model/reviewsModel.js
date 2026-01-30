const { pool } = require("../config/db.js");

exports.getAllReviewsWithAllDetails = async () => {
    try {
        const result = await pool.query(
            `SELECT
                r.review_id,
                r.emp_id,
                emp.name,
                r.reviewer_emp_id,
                r.department_id,
                DATE_FORMAT(r.review_date, '%Y-%m-%d') AS review_date,
                r.review_text,
                r.rating,
                d.department_name
            FROM
                reviews r
            JOIN 
                department d ON r.department_id = d.department_id
            JOIN 
                employeedata emp ON r.emp_id = emp.emp_id`
        );
        const rows = result && result[0] ? result[0] : result;
        return rows;
    } catch (e) {
        console.error('Error fetching all reviews with details: ', e);
        throw e;
    }
};

exports.getReviewByEmployeeId = async (review_id) => {
    try {
        const result = await pool.query(
            `SELECT
                r.review_id,
                r.emp_id,
                emp.name,
                r.reviewer_emp_id,
                reviewer_emp.name AS reviewer_name,
                r.department_id,
                DATE_FORMAT(r.review_date, '%Y-%m-%d') AS review_date,
                r.review_text,
                r.rating,
                d.department_name
            FROM
                reviews r
            JOIN 
                department d ON r.department_id = d.department_id
            JOIN 
                employeedata emp ON r.emp_id = emp.emp_id
            JOIN
                employeedata reviewer_emp ON r.reviewer_emp_id = reviewer_emp.emp_id
            WHERE
                r.review_id = ?`, [review_id]
        );
        const rows = result && result[0] ? result[0] : result;
        return rows && rows[0] ? rows[0] : null;
    } catch (e) {
        console.error('Error fetching review for employee: ', e);
        throw e;
    }
};

exports.addReview = async (review) => {
    const { emp_id, reviewer_emp_id, department_id, review_date, review_text, rating } = review;
    try {
        let parsedReviewDate = new Date(review_date);
        if (isNaN(parsedReviewDate.getTime())) {
            throw new Error('Invalid review_date provided. Please use YYYY-MM-DD format.');
        }
        const formattedReviewDate = parsedReviewDate.toISOString().split('T')[0];

        const result = await pool.query(
            `INSERT INTO reviews (emp_id, reviewer_emp_id, department_id, review_date, review_text, rating)
            VALUES (?, ?, ?, ?, ?, ?)`, [emp_id, reviewer_emp_id, department_id, formattedReviewDate, review_text, rating]
        );
        const affected = result && result.affectedRows ? result.affectedRows : 0;
        return { affectedRows: affected };
    } catch (e) {
        console.error('Error creating review: ', e);
        throw e;
    }
};

exports.updateReview = async (review_id, reviewData) => {
    const { emp_id, reviewer_emp_id, department_id, review_date, review_text, rating } = reviewData;
    try {
        const result = await pool.query(
            `UPDATE reviews 
            SET 
                emp_id = ?, 
                reviewer_emp_id = ?, 
                department_id = ?, 
                review_date = ?, 
                review_text = ?, 
                rating = ? 
            WHERE review_id = ?`,
            [emp_id, reviewer_emp_id, department_id, review_date, review_text, rating, review_id]
        );
        const affected = result && result.affectedRows ? result.affectedRows : 0;
        if (affected === 0) {
            throw new Error(`Review with ID ${review_id} not found`);
        }
        return { affectedRows: affected };
    } catch (e) {
        console.error('Error updating review: ', e);
        throw e;
    }
};

exports.deleteReview = async (review_id) => {
    try {
        const result = await pool.query(
            'DELETE FROM reviews WHERE review_id = ?', [review_id]
        );
        const affected = result && result.affectedRows ? result.affectedRows : 0;
        if (affected === 0) {
            throw new Error(`Review with ID ${review_id} not found`);
        }
        return { affectedRows: affected };
    } catch (e) {
        console.error('Error deleting review: ', e);
        throw e;
    }
};
