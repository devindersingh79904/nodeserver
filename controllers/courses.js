const asyncHandler = require("../middleware/asyncHandler")
const Course = require("../models/Course")
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require("../Utils/ErrorResponse")
const { CREATED, SUCCESS, NOT_FOUND, BAD_REQUEST } = require("../Utils/httpConst")


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



//@desc Get courses
//@route GET /api/v1/courses/:id
//@access Public

exports.getCourse = asyncHandler(async(req,res,next) => {    
    
    const id = req.params.id
    const course =await Course.findById(id).populate({
            path : 'bootcamp',
            select : 'name description'
        });
    
        if(course == null){
            return next(new ErrorResponse(`No course find with id ${id}`,NOT_FOUND))
        }
        res.status(SUCCESS).json({success:true,data:course})

})



//@desc ADD courses
//@route POST /api/v1bootcamps/:bootcamId/courses
//@access private

exports.addCourse = asyncHandler(async(req,res,next) => {    
    
    const id = req.params.bootcampId

    const bootcamp = await Bootcamp.findById(id)

    if(bootcamp == null){
        return next(new ErrorResponse( `Bootcamp with id : ${id} not found`,NOT_FOUND))
    }
    
    req.body.bootcamp = id

    const course = await Course.create(req.body);

    if(course == null){
        return next(new ErrorResponse( `unable to create new course`,BAD_REQUEST))
    }

    res.status(SUCCESS).json({success:true,data:course})
})