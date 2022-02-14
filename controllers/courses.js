const asyncHandler = require("../middleware/asyncHandler")
const Course = require("../models/Course")
const ErrorResponse = require("../Utils/ErrorResponse")
const { CREATED, SUCCESS, NOT_FOUND } = require("../Utils/httpConst")


//@desc Get courses
//@route GET /api/v1/courses
//@route GET /api/v1bootcamps/:bootcamId/courses
//@access Public

exports.getCourses = asyncHandler(async(req,res,next) => {    
    
    let query;

    if(req.params.bootcampId){
        query = Course.find({bootcamp : req.params.bootcampId});
    }else{
        query = Course.find().populate({
            path : 'bootcamp',
            select : 'name description'
        });
    }

    const courses = await query;

    res.status(SUCCESS).json({success:true,count:courses.length,data:courses})
})
