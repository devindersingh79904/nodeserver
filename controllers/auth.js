const asyncHandler = require("../middleware/asyncHandler")
const User = require("../models/User")
const ErrorResponse = require("../Utils/ErrorResponse")
const { CREATED, SUCCESS, NOT_FOUND, BAD_REQUEST, SERVER_ERROR, NOT_AUTHENTICATED } = require("../Utils/httpConst")


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