const ErrorResponse = require("../Utils/ErrorResponse");
const { SERVER_ERROR, NOT_FOUND } = require("../Utils/httpConst");

const errorHandler = (err,req,res,next) => {
    let error = {...err}
    error.message = err.message;

    console.log(err)
    console.log(err.name)

    if(err.name==='CastError'){
        const message = `Bootcamp not found with id of ${err.value}`
        error = new ErrorResponse(message,NOT_FOUND)
    }
    else if(err.code == 11000){
        const message = `Duplicate field value added`
        error = new ErrorResponse(message,NOT_FOUND)
    }
    else if(err.name === 'ValidationError'){
        let message = "ValidationError : " + Object.values(err.errors).map(error => error.message)
        error = new ErrorResponse(message,NOT_FOUND)
    }

    res.status(error.statusCode || SERVER_ERROR).json({
       sucess : false,
       error:error.message
   })
}

module.exports = errorHandler;