const express = require('express');
const { getAllUsers, getUserById ,createUser,updateUser,deleteUser } = require('../controllers/user');
const advancedResult = require('../middleware/advanceResult');
const { protect ,authorize } = require('../middleware/auth');
const User = require('../models/User');


const router = express.Router();

router.use(protect)
router.use(authorize('admin'))
router.route('/').get(advancedResult(User),getAllUsers).post(createUser)
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser)
module.exports = router