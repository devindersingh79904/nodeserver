const express = require('express');
const coursesRouter =  require('./courses')

const { getBootcamps, getBootcamp, postBootcamp, putBootcamp, deleteBootcamp, getBootcampsByRadius, bootcampPhotoUpload } = require('../controllers/bootcamps');

const router = express.Router();

//re-write courses

router.use("/:bootcampId/courses",coursesRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsByRadius)

router.route("/:id/photo").put(bootcampPhotoUpload)

router.route("/").get(getBootcamps).post(postBootcamp)

router.route("/:id").get(getBootcamp).put(putBootcamp).delete(deleteBootcamp)


module.exports = router