const crypto = require('crypto')
const asyncHandler = require("../middleware/asyncHandler")
const User = require("../models/User")
const ErrorResponse = require("../Utils/ErrorResponse")
const { CREATED, SUCCESS, NOT_FOUND, BAD_REQUEST, SERVER_ERROR, NOT_AUTHENTICATED } = require("../Utils/httpConst")
const sendEmail = require('../Utils/sendEmail')

//@desc     register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.registerUser = asyncHandler(async(req,res,next) => {    

    const user = await User.create(req.body)
    sendTokenResponse(user,SUCCESS,res)
})


//@desc     login user
//@route    POST /api/v1/auth/login
//@acces]s  Public
exports.loginUser = asyncHandler(async(req,res,next) => {    

    const {email,password} = req.body

    if( !email || !password){
        return next(new ErrorResponse("please provide email and password",BAD_REQUEST))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorResponse("Invalid Cradentials",NOT_AUTHENTICATED))
    }

    const isMatch = await user.matchPassword(password)
    
    if(!isMatch){
        return next(new ErrorResponse("Invalid Cradentials",NOT_AUTHENTICATED))
    }

    
   sendTokenResponse(user,SUCCESS,res)

})




//@desc     get loggedin user
//@route    GET /api/v1/auth/me
//@acces]s  Private
exports.getMe = asyncHandler(async(req,res,next) => {    

    const user = await User.findById(req.user._id)
    res.status(SUCCESS).json({sucess:true,data:user})

})


//@desc     forget password
//@route    GET /api/v1/auth/forgetpassword
//@acces]s  PUBLIC
exports.forgetPassword = asyncHandler(async(req,res,next) => {    

    const {email} = req.body
    let user = await User.findOne({email})
    if(!user){
        return next(new ErrorResponse('There is no user with email',NOT_FOUND))
    }

    const resetToken = user.getResetPasswordToken()

    user = await user.save({validateBeforeSave:false})

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
 
})


//@desc     forget password
//@route    GET /api/v1/auth/resetpassword/:resettoken')
//@acces]s  PUBLIC
exports.resetPassword = asyncHandler(async(req,res,next) => {    
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')

    let user = await User.findOne({resetPasswordToken ,
      resetPasswordExpire : {
        $gt : Date.now()
      } })

    if(!user){
      return next( new ErrorResponse("Invalid token",BAD_REQUEST))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user = await user.save()
    res.status(SUCCESS).json({sucess:true,data : user})
})








//get jwt token and create cookie and set response
const sendTokenResponse = (user,statusCode,res)=>{

    const token = user.getSignedJwtToken()
    const options = {
      expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60  * 1000),
      httpOnly:true
    }

    if(process.env.NODE_ENV == 'production'){
        options.secure=true
    }
    res.status(statusCode)
    .cookie('token',token,options)
    .json(
      {sucess:true,
        token
      })
  }