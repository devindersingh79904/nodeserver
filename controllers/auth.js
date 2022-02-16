const asyncHandler = require("../middleware/asyncHandler")
const User = require("../models/User")
const ErrorResponse = require("../Utils/ErrorResponse")
const { CREATED, SUCCESS, NOT_FOUND, BAD_REQUEST, SERVER_ERROR } = require("../Utils/httpConst")



exports.registerUser = asyncHandler(async(req,res,next) => {    

    const user = await User.create(req.body)
    const token = user.getSignedJwtToken()
    res.status(SUCCESS).json({sucess:true,token})
})