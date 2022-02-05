const { SERVER_ERROR } = require("../Utils/httpConst");

const errorHandler = (err,req,res,next) => {
    const error = {...err}

    console.log(err.stack.red)
    console.log(`${err}`.yellow)


    res.status(error.statusCode || SERVER_ERROR).json({
       sucess : false,
       error:error.message
   })
}

module.exports = errorHandler;