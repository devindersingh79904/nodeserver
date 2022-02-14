const asyncHandler = require("../middleware/asyncHandler")
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../Utils/ErrorResponse")
const geocoder = require("../Utils/geocoder")
const { CREATED, SUCCESS, NOT_FOUND } = require("../Utils/httpConst")


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
    const bootcamp = await Bootcamp.findByIdAndDelete(id)

    if(bootcamp == null){
        return next(new ErrorResponse(`No bootcamp find with id ${id}`,NOT_FOUND))
    }
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


