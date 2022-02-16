const asyncHandler = require("../middleware/asyncHandler")
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../Utils/ErrorResponse")
const geocoder = require("../Utils/geocoder")
const path = require('path')
const { CREATED, SUCCESS, NOT_FOUND, BAD_REQUEST, SERVER_ERROR } = require("../Utils/httpConst")


exports.getBootcamps = asyncHandler(async(req,res,next) => {    
    let query;
    //create a copy of query
    const reqQuery = {...req.query}
    
    //fields to exclude
    const removeFields = ['select','sort','limit','page']
    console.log(reqQuery)
    removeFields.forEach( param => delete reqQuery[param])
    console.log(reqQuery)
    //append $ sign front of operator(gt,lt,gte,lte,in)
    
    const queryStr= JSON.stringify(reqQuery).replace(/\b(gt|lt|lte|gte|in)\b/g, match => `$${match}`);
    query =  Bootcamp.find(JSON.parse(queryStr)).populate({
        path:'courses',
        select : 'title'
    })
    
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }
    else{
        const sortBy = '-createdAt'
        query = query.sort(sortBy)
    }


    //pagination
    const page = parseInt(req.query.page,10) || 1
    const limit = parseInt(req.query.limit,10) || 25
    const startIndex = (page - 1) * limit;
    const endIndex = page  * limit
    const total =  await Bootcamp.countDocuments()

    query = query.skip(startIndex).limit(limit)

    //pagination result

    const pagination = {}

    if(endIndex < total){
        pagination.next = {
            page : page + 1,
            limit
        }
    }

    if(startIndex > 0){
        pagination.pre = {
            page : page - 1,
            limit
        }
    }


    const bootcamps = await query;
    res.status(SUCCESS).json({success:true,count:bootcamps.length, pagination,data:bootcamps})
} )

exports.getBootcamp = asyncHandler(async(req,res,next) => {
        const id = req.params.id;
        const bootcamp = await Bootcamp.findById(id)
        if(bootcamp == null){
            return next(new ErrorResponse(`No bootcamp find with id ${id}`,NOT_FOUND))
        }
        res.status(SUCCESS).json({success:true,data:bootcamp})
        

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
    const bootcamp = await Bootcamp.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true
    })

    if(bootcamp == null){
        return next(new ErrorResponse(`No bootcamp find with id ${id}`,NOT_FOUND))
    }
    res.status(SUCCESS).json({success:true,data:bootcamp})
})

exports.deleteBootcamp = asyncHandler(async(req,res,next) => {
    
    const id = req.params.id;
    const bootcamp = await Bootcamp.findById(id)

    if(bootcamp == null){
        return next(new ErrorResponse(`No bootcamp find with id ${id}`,NOT_FOUND))
    }

    await bootcamp.remove()
    res.status(SUCCESS).json({success:true,msg:'bootcamp deleted succesfully'})
})


exports.getBootcampsByRadius = asyncHandler(async(req,res,next) => {
    
    const { zipcode, distance } = req.params;
    
    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    let lat,lng
    loc.forEach(location => {
        if(location.zipcode === zipcode)
        {
            lat = location.latitude;
            lng = location.longitude;
        }
        
    })
    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963.2;
  
    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [ [ lng,lat ], radius ] } }
    });
  
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    });

})


//@desc upload photo
//@route PUT /api/v1/bootcamps/:id/photo
//@access private

exports.bootcampPhotoUpload = asyncHandler(async(req,res,next) => {
    const id = req.params.id;
    let bootcamp = await Bootcamp.findById(id)

    if(bootcamp == null){
        return next(new ErrorResponse(`No bootcamp find with id ${id}`,NOT_FOUND))
    }
    
    if(!req.files){
        return next(new ErrorResponse(`Please upload a photo.`,BAD_REQUEST))
    }

    const file = req.files.file
    //make sure image is photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload a image file`,BAD_REQUEST))
    }

    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload a image less than ${process.env.MAX_FILE_UPLOAD} bytes`,BAD_REQUEST))
    }

    //create_custome filename

    file.name = `photo_${id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err => {
        if(err){
            console.error(err)
            return next(new ErrorResponse(`Problem with file upload`,SERVER_ERROR))
        }
    })
     

    bootcamp = await Bootcamp.findByIdAndUpdate(id,{
        photo:file.name
    },{
        new:true,
        runValidators:true
    })
    res.status(SUCCESS).json({success:true,photo:bootcamp.photo,data:bootcamp})
})