

exports.getBootcamps = (req,res,next) => {
    res.status(200).json({success:true,msg : "show all bootcames"})
} 

exports.getBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg : `get bootcamp ${req.params.id}`})
}

exports.postBootcamp = (req,res,next) => {
    res.status(201).json({success:true,msg : `add bootcamp`})
}

exports.putBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg : `put bootcamp ${req.params.id}`})
}

exports.deleteBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg : `delete bootcamp ${req.params.id}`})
}