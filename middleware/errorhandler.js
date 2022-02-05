const { SERVER_ERROR } = require("../Utils/httpConst");

const errorHandler = (err,req,res,next) => {
    console.log(err)
   res.status(err.statusCode || SERVER_ERROR).json({
       sucess : false,
       error:err.message
   })
}

module.exports = errorHandler;