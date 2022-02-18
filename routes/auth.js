const express = require('express');
const { registerUser, loginUser, getMe, forgetPassword, resetPassword, updateUserDetails, updateUserPassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');


const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(protect, getMe)
router.route('/forgetpassword').get(forgetPassword)
router.route('/resetpassword/:resettoken').put(resetPassword)
router.route('/updatedetails').put(protect,updateUserDetails)
router.route('/updatepassword').put(protect,updateUserPassword)

module.exports = router