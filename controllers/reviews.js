const asyncHandler = require("../middleware/asyncHandler")
const Review = require("../models/Review")
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require("../Utils/ErrorResponse")
const { CREATED, SUCCESS, NOT_FOUND, BAD_REQUEST ,NOT_AUTHENTICATED } = require("../Utils/httpConst")


//@desc     Get reviews
//@route    GET /api/v1/reviews
//@route    GET /api/v1bootcamps/:bootcamId/reviews
//@access   Public
exports.getReviews = asyncHandler(async(req,res,next) => {    
    
    let query;

    if(req.params.bootcampId){
        query = Review.find({bootcamp : req.params.bootcampId});
        const reviews = await query;
        return res.status(SUCCESS).json({success:true,count:reviews.length,data:reviews})
    }
    res.status(SUCCESS).json(res.advancedResult)
})



//@desc     Get review by id
//@route    GET /api/v1/reviews/:id
//@access   Private
exports.getReviewById = asyncHandler(async(req,res,next) => {    
    
    const id = req.params.id

    const review =await Review.findById(id).populate({
            path : 'bootcamp',
            select : 'name description'
        });
    
        if(review == null){
            return next(new ErrorResponse(`No review find with id ${id}`,NOT_FOUND))
        }
        res.status(SUCCESS).json({success:true,data:review})

})



//@desc     ADD review
//@route    POST /api/v1/bootcamps/:bootcamId/reviews
//@access   private
exports.addReview = asyncHandler(async(req,res,next) => {    
    
    const bootcampId = req.params.bootcampId 
    const bootcamp = await Bootcamp.findById(bootcampId)

    if(bootcamp == null){
        return next(new ErrorResponse( `Bootcamp with id : ${id} not found`,NOT_FOUND))
    }

    req.body.bootcamp = bootcampId
    req.body.user=req.user._id

    const review = await Review.create(req.body);

    if(review == null){
        return next(new ErrorResponse( `unable to create new review`,BAD_REQUEST))
    }

    res.status(CREATED).json({success:true,data:review})
})




//@desc     update reviews
//@route    PUT /api/v1/reviews/:id
//@access   private
exports.updateReview = asyncHandler(async(req,res,next) => {    
    
    const id = req.params.id

    let review = await Review.findById(id);

    if(review == null){
        return next(new ErrorResponse( `no review with id of ${id}`,NOT_FOUND))
    }

    if(review.user.toString() !== req.user.id && req.user.role !== 'admin' ){
        return next(new ErrorResponse(`User ${req.user._id} is not authorized to update a review ${review._id}`,NOT_AUTHENTICATED))
    }


    review = await Review.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true
    });

    review.save()

    res.status(SUCCESS).json({success:true,data:review})
})



//@desc     delete reviews
//@route    DELETE /api/v1/reviews/:id
//@access   private

exports.deleteReview = asyncHandler(async(req,res,next) => {    
    
    const id = req.params.id
    let review = await Review.findById(id);
    if(review == null){
        return next(new ErrorResponse( `no review with id of ${id}`,NOT_FOUND))
    }

    if(review.user.toString() !== req.user.id && req.user.role !== 'admin' ){
        return next(new ErrorResponse(`User ${id} is not authorized to delete a review ${review._id}`,NOT_AUTHENTICATED))
    }
    await review.remove();
    res.status(SUCCESS).json({success:true,msg:'review deleted succesfully'})
})