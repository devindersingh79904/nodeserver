const express = require('express');
const { registerUser, loginUser, getMe, forgetPassword, resetPassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');


const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(protect, getMe)
router.route('/forgetpassword').get(forgetPassword)
router.route('/resetpassword/:resettoken').put(resetPassword)
module.exports = router