const asyncHandler = require("../middleware/asyncHandler")
const Course = require("../models/Course")
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require("../Utils/ErrorResponse")
const { CREATED, SUCCESS, NOT_FOUND, BAD_REQUEST ,NOT_AUTHENTICATED } = require("../Utils/httpConst")


//@desc Get courses
//@route GET /api/v1/courses
//@route GET /api/v1bootcamps/:bootcamId/courses
//@access Public

exports.getCourses = asyncHandler(async(req,res,next) => {    
    
    let query;

    if(req.params.bootcampId){
        query = Course.find({bootcamp : req.params.bootcampId});
        const courses = await query;
        return res.status(SUCCESS).json({success:true,count:courses.length,data:courses})
    }
    res.status(SUCCESS).json(res.advancedResult)
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

    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin' ){
        return next(new ErrorResponse(`User ${id} is not authorized to add a course to bootcamp ${bootcamp.id}`,NOT_AUTHENTICATED))
    }
    
    req.body.bootcamp = id
    req.body.user=req.user.id
    const course = await Course.create(req.body);

    if(course == null){
        return next(new ErrorResponse( `unable to create new course`,BAD_REQUEST))
    }

    res.status(CREATED).json({success:true,data:course})
})




//@desc     update courses
//@route    PUT /api/v1/courses/:id
//@access   private
exports.updateCourse = asyncHandler(async(req,res,next) => {    
    
    const id = req.params.id
    let course = await Course.findById(id);
    if(course == null){
        return next(new ErrorResponse( `no course with id of ${id}`,NOT_FOUND))
    }

    if(course.user.toString() !== req.user.id && req.user.role !== 'admin' ){
        return next(new ErrorResponse(`User ${id} is not authorized to update a course ${course._id}`,NOT_AUTHENTICATED))
    }


    course = await Course.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true
    });

    res.status(SUCCESS).json({success:true,data:course})
})



//@desc delete courses
//@route DELETE /api/v1/courses/:id
//@access private

exports.deleteCourse = asyncHandler(async(req,res,next) => {    
    
    const id = req.params.id
    let course = await Course.findById(id);
    if(course == null){
        return next(new ErrorResponse( `no course with id of ${id}`,NOT_FOUND))
    }

    if(course.user.toString() !== req.user.id && req.user.role !== 'admin' ){
        return next(new ErrorResponse(`User ${id} is not authorized to delete a course ${course._id}`,NOT_AUTHENTICATED))
    }
    await course.remove();
    res.status(SUCCESS).json({success:true,msg:'course deleted succesfully'})
})