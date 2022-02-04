const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../Utils/ErrorResponse")


exports.getBootcamps = (req,res,next) => {
    res.status(200).json({success:true,msg : "show all bootcames"})
} 

exports.getBootcamp = (req,res,next) => {

    try {
        const bootcames = Bootcamp.findById(req.params.id)
        
        if(bootcames != null){
            return next(new ErrorResponse(['ii','i','herwd'],404))
        }
        console.log('hi')
        res.status(200).json({success:true,msg : `get bootcamp ${req.params.id}`})
        
    } catch (error) {
        next(error)
    }

}

exports.postBootcamp = (req,res,next) => {
    try {
        const bootcames = Bootcamp.create(req.body)
        
        if(bootcames != null){
            return next(new ErrorResponse(['hi','i ', 'there'],404))
        }
        console.log('hi')
        res.status(200).json({success:true,msg : `get bootcamp ${req.params.id}`})
        
    } catch (error) {
        next(error)
    }
}

exports.putBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg : `put bootcamp ${req.params.id}`})
}

exports.deleteBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg : `delete bootcamp ${req.params.id}`})
}

