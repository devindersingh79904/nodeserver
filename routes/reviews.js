const express = require('express');
const advancedResult = require('../middleware/advanceResult');
const { protect ,authorize } = require('../middleware/auth');
const Review = require('../models/Review');


const router = express.Router({mergeParams:true});

router.route('/').get(protect,advancedResult(Review))


router.route('/:id').get(protect,).put().delete()

module.exports = router