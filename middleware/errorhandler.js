const { DUPLICATE_KEY_ERROR, CAST_ERROR, VALIDATION_ERROR } = require("../Utils/ErrorConstant");
const ErrorResponse = require("../Utils/ErrorResponse");
const { SERVER_ERROR, NOT_FOUND, BAD_REQUEST } = require("../Utils/httpConst");

const errorHandler = (err,req,res,next) => {
    let error = {...err}
    error.message = err.message;
 
    console.log(err)
    console.log(err.name)

    if(err.name === CAST_ERROR){
        const message = `Resource not found with id ${err.value}`
        error = new ErrorResponse(message,NOT_FOUND)
    }
    else if(err.code === DUPLICATE_KEY_ERROR){
        const message = `${err.message}`
        error = new ErrorResponse(message,BAD_REQUEST)
    }
    else if( err.name === VALIDATION_ERROR){
        const message = Object.values(err.errors).map(err=> err.message)
        error = new ErrorResponse(message,NOT_FOUND)
    }

    res.status(error.statusCode || SERVER_ERROR).json({
       sucess : false,
       error:error.message
   })
}

module.exports = errorHandler;