const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController'); 

router.get('/', reviewsController.getAllReviewsWithDetails);
router.get('/:review_id', reviewsController.getReviewByEmployeeId);
router.post('/', reviewsController.addReview);
router.put('/:review_id', reviewsController.updateReview);
router.delete('/:review_id', reviewsController.deleteReview);

module.exports = router;