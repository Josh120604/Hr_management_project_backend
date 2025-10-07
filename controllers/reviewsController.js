const Review = require('../model/reviewsModel'); 

exports.getAllReviewsWithDetails = async (req, res) => {
    try {
        const reviews = await Review.getAllReviewsWithAllDetails();
        res.status(200).json(reviews);
    } catch (e) {
        console.error('Error in getAllReviewsWithDetails:', e);
        res.status(500).json({ error: 'Failed to retrieve all reviews with details' });
    }
};

exports.getReviewByEmployeeId = async (req, res) => {
    try {
        const { review_id } = req.params;
        const review = await Review.getReviewByEmployeeId(review_id);

        if (!review) {
            return res.status(404).json({ message: `Review with ID ${review_id} not found` });
        }
        res.status(200).json(review);
    } catch (e) {
        console.error('Error in getReviewByEmployeeId:', e);
        res.status(500).json({ error: 'Failed to retrieve review by ID' });
    }
};

exports.addReview = async (req, res) => {
    try {
        const newReviewData = req.body;
        const result = await Review.addReview(newReviewData);

        res.status(201).json({ message: 'Review added successfully!', reviewId: result.insertId });
    } catch (e) {
        console.error('Error in addReview:', e);
        res.status(500).json({ error: 'Failed to add review record' });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { review_id } = req.params; 
        const updatedReviewData = req.body; 

        const result = await Review.updateReview(review_id, updatedReviewData);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Review with ID ${review_id} not found or no changes made` });
        }

        res.status(200).json({ message: `Review ${review_id} updated successfully!` });
    } catch (e) {
        console.error('Error in updateReview:', e);
        res.status(500).json({ error: 'Failed to update review record' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { review_id } = req.params;
        const result = await Review.deleteReview(review_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `No review record found with ID ${review_id} to delete` });
        }

        res.status(200).json({ message: `Review ${review_id} deleted successfully!` });
    } catch (e) {
        console.error('Error in deleteReview:', e);
        res.status(500).json({ error: 'Failed to delete review record' });
    }
};
