const express = require('express');
const coursesRouter =  require('./courses')

const { getBootcamps, getBootcamp, postBootcamp, putBootcamp, deleteBootcamp, getBootcampsByRadius, bootcampPhotoUpload } = require('../controllers/bootcamps');
const advancedResult = require('../middleware/advanceResult');
const Bootcamp = require('../models/Bootcamp');
const {protect,authorize} = require('../middleware/auth');

const router = express.Router();

//re-write courses

router.use("/:bootcampId/courses",coursesRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsByRadius)

router.route("/:id/photo").put(protect,authorize('publisher','admin'),bootcampPhotoUpload)

router.route("/").get(advancedResult(Bootcamp,{
    path:'courses',
    select : 'title'
}),getBootcamps).post(protect,authorize('publisher','admin'), postBootcamp)

router.route("/:id").get(getBootcamp).put(protect,authorize('publisher','admin'),putBootcamp).delete(protect,authorize('publisher','admin'),deleteBootcamp)


module.exports = router