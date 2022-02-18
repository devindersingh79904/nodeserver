const express = require('express');
const { getReviews, getReviewById, updateReview, deleteReview, addReview } = require('../controllers/reviews');
const advancedResult = require('../middleware/advanceResult');
const { protect ,authorize } = require('../middleware/auth');
const Review = require('../models/Review');



const router = express.Router({mergeParams:true});

router.use(protect)

router.route('/').get(protect,advancedResult(Review),getReviews).post(addReview)
router.route('/:id').get(getReviewById).put(updateReview).delete(deleteReview)

module.exports = router