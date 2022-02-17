const asyncHandler = require("../middleware/asyncHandler")
const User = require("../models/User")
const ErrorResponse = require("../Utils/ErrorResponse")
const { CREATED, SUCCESS, NOT_FOUND, BAD_REQUEST, SERVER_ERROR, NOT_AUTHENTICATED } = require("../Utils/httpConst")


//@desc     register user
//@route    POST /api/v1/auth/register
//@access   Public

exports.registerUser = asyncHandler(async(req,res,next) => {    

    const user = await User.create(req.body)
    const token = user.getSignedJwtToken()
    res.status(SUCCESS).json({sucess:true,token})
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

    
    const token = user.getSignedJwtToken()
    res.status(SUCCESS).json({sucess:true,token})

})