const asyncHandler = require("../middleware/asyncHandler")
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../Utils/ErrorResponse")


exports.getBootcamps = asyncHandler(async(req,res,next) => {
    res.status(200).json({success:true,msg : "show all bootcames"})
} )

exports.getBootcamp = asyncHandler(async(req,res,next) => {


        const bootcames = Bootcamp.findById(req.params.id)
        if(bootcames != null){
            return next(new ErrorResponse(['ii','i','herwd'],404))
        }
        res.status(200).json({success:true,msg : `get bootcamp ${req.params.id}`})
        

})

exports.postBootcamp = asyncHandler(async(req,res,next) => {
   
        const bootcames = Bootcamp.create(req.body)
        
        if(bootcames != null){
            return next(new ErrorResponse(['hi','i ', 'there'],404))
        }
        console.log('hi')
        res.status(200).json({success:true,msg : `get bootcamp ${req.params.id}`})
        

})

exports.putBootcamp = asyncHandler(async(req,res,next) => {
    res.status(200).json({success:true,msg : `put bootcamp ${req.params.id}`})
})

exports.deleteBootcamp = asyncHandler(async(req,res,next) => {
    res.status(200).json({success:true,msg : `delete bootcamp ${req.params.id}`})
})

