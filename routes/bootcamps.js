const express = require('express');
const { getBootcamps, getBootcamp, postBootcamp, putBootcamp, deleteBootcamp } = require('../controllers/bootcamps');

const router = express.Router();

router.get('/',getBootcamps);

router.get('/:id',getBootcamp);
router.post('/:id',postBootcamp);
router.put('/:id',putBootcamp);
router.delete('/:id',deleteBootcamp);

module.exports = router