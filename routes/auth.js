const express = require('express');
const { registerUser, loginUser, getMe, forgetPassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');


const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(protect, getMe)
router.route('/forgetpassword').get(forgetPassword)
module.exports = router