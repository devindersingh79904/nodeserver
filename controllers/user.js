const asyncHandler = require("../middleware/asyncHandler")
const User = require("../models/User")
const ErrorResponse = require("../Utils/ErrorResponse")
const { CREATED, SUCCESS, NOT_FOUND, BAD_REQUEST ,NOT_AUTHENTICATED } = require("../Utils/httpConst")


//@desc     Get users
//@route    GET /api/v1/users
//@access   Private/admin
exports.getAllUsers = asyncHandler(async(req,res,next) => {    
    res.status(SUCCESS).json(res.advancedResult)
})


//@desc     Get Single User
//@route    GET /api/v1/users/:id
//@access   Private/admin
exports.getUserById = asyncHandler(async(req,res,next) => {
    
    const id = req.params.id
    const user = await User.findById(id)
    if(!user){
        return next(new ErrorResponse(`no user found with id ${id}`,BAD_REQUEST))
    }
    res.status(SUCCESS).json({success:true,data:user})
})


//@desc     create a User
//@route    POST /api/v1/users
//@access   Private/admin
exports.createUser = asyncHandler(async(req,res,next) => {
    
    const user = await User.create(req.body)
    if(!user){
        return next(new ErrorResponse(`unable to create new User`,BAD_REQUEST))
    }
    res.status(SUCCESS).json({success:true,data:user})
})

//@desc     update a User
//@route    PUT /api/v1/users/:id
//@access   Private/admin
exports.updateUser = asyncHandler(async(req,res,next) => {
    
    const id = req.params.id
    const user = await User.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidator:true
    })
    if(!user){
        return next(new ErrorResponse(`no user found with id ${id}`,BAD_REQUEST))
    }
    res.status(SUCCESS).json({success:true,data:user})
})

//@desc     delete a User
//@route    DELETE /api/v1/users/:id
//@access   Private/admin
exports.deleteUser = asyncHandler(async(req,res,next) => {
    
    const id = req.params.id
    const user = await User.findByIdAndDelete(id)
    if(!user){
        return next(new ErrorResponse(`no user found with id ${id}`,BAD_REQUEST))
    }
    res.status(SUCCESS).json({success:true,msg:"user deleted"})
})