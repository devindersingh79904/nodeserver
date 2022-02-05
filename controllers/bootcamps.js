const asyncHandler = require("../middleware/asyncHandler")
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../Utils/ErrorResponse")
const { CREATED, SUCCESS } = require("../Utils/httpConst")


exports.getBootcamps = asyncHandler(async(req,res,next) => {

    const bootcamps = await Bootcamp.find();
    res.status(SUCCESS).json({success:true,data:bootcamps})
} )

exports.getBootcamp = asyncHandler(async(req,res,next) => {

        const id = req.params.id;
        const bootcamp = await Bootcamp.findById(id)
        if(bootcamp == null){
            return next(new ErrorResponse(`No bootcamp find with id ${id}`,404))
        }
        res.status(200).json({success:true,data:bootcamp})
        

})

exports.postBootcamp = asyncHandler(async(req,res,next) => {
        const bootcamp = await Bootcamp.create(req.body)
        console.log(`${bootcamp}`.cyan)
        if(bootcamp == null){
            return next(new ErrorResponse('Unable to create bootcamp',404))
        }
        res.status(CREATED).json({success:true,data:bootcamp})
        

})

exports.putBootcamp = asyncHandler(async(req,res,next) => {

    const id = req.params.id;
    res.status(200).json({success:true,msg : `put bootcamp ${req.params.id}`})
})

exports.deleteBootcamp = asyncHandler(async(req,res,next) => {
    
    const id = req.params.id;
    const bootcamp = await Bootcamp.findByIdAndDelete(id)

    if(bootcamp == null){
        return next(new ErrorResponse(`No bootcamp find with id ${id}`,404))
    }
    res.status(200).json({success:true,msg:'bootcamp deleted succesfully'})
})

