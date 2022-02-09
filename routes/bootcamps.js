const express = require('express');
const { getBootcamps, getBootcamp, postBootcamp, putBootcamp, deleteBootcamp, getBootcampsByRadius } = require('../controllers/bootcamps');

const router = express.Router();


router.route('/radius/:zipcode/:distance').get(getBootcampsByRadius)


router.route("/").get(getBootcamps).post(postBootcamp)

router.route("/:id").get(getBootcamp).put(putBootcamp).delete(deleteBootcamp)


module.exports = router