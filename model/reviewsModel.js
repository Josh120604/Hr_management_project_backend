const { pool } = require("../config/db.js");

exports.getAllReviewsWithAllDetails = async () => {
    try {
        const [rows] = await pool.query(
            `SELECT
                r.review_id,
                r.emp_id,
                emp.name,
                r.reviewer_emp_id,
                r.department_id,
                r.review_date,
                r.review_text,
                r.rating,
                d.department_name
            FROM
                reviews r
            JOIN 
                department d ON r.department_id = d.department_id
            JOIN 
                EmployeeData emp ON r.emp_id = emp.emp_id`
        );
        return rows;
    } catch (e) {
        console.error('Error fetching all reviews with details: ', e);
        throw e;
    }
}

exports.getReviewByEmployeeId = async (review_id) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                r.review_id,
                r.emp_id,
                emp.name,
                r.reviewer_emp_id,
                reviewer_emp.name AS reviewer_name,
                r.department_id,
                r.review_date,
                r.review_text,
                r.rating,
                d.department_name
            FROM
                Reviews r
            JOIN 
                department d ON r.department_id = d.department_id
            JOIN 
                EmployeeData emp ON r.emp_id = emp.emp_id
            JOIN
                EmployeeData reviewer_emp ON r.reviewer_emp_id = reviewer_emp.emp_id
            WHERE
                r.review_id = ?`, [review_id]
        );
        return rows[0];
    } catch (e) {
        console.error('Error fetching review for employee: ', e);
        throw e;
    }
}

exports.addReview = async (review) => {
        const {emp_id, reviewer_emp_id, department_id, review_date, review_text, rating} = review;
    try {
        let parsedReviewDate = new Date(review_date);
        if (isNaN(parsedReviewDate.getTime())) {
            throw new Error('Invalid review_date provided. Please use YYYY-MM-DD format.');
        }
        const formattedReviewDate = parsedReviewDate.toISOString().split('T')[0];

        const [result] = await pool.query(
            `INSERT INTO Reviews (emp_id, reviewer_emp_id, department_id, review_date, review_text, rating)
            VALUES (?, ?, ?, ?, ?, ?)`, [emp_id, reviewer_emp_id, department_id, formattedReviewDate, review_text, rating] 
        );
        return result;
    } catch (e) {
        console.error('Error creating review: ', e);
        throw e;
    }
}

exports.updateReview = async (review_id, reviewData) => {
    const { emp_id, reviewer_emp_id, department_id, review_date, review_text, rating } = reviewData
    try {
        const [result] = await pool.query(
            `UPDATE Reviews 
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
        if (result.affectedRows === 0) {
            throw new Error(`Review with ID ${review_id} not found`);
        }
        return result;
    } catch (e) {
        console.error('Error updating review: ', e);
        throw e;
    }
}

exports.deleteReview = async (review_id) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM Reviews WHERE review_id = ?', [review_id]
        );
        if (result.affectedRows === 0) {
            throw new Error(`Review with ID ${review_id} not found`);
        }
        return result;
    } catch (e) {
        console.error('Error deleting review: ', e);
        throw e;
    }
}