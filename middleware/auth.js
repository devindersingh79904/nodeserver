const ErrorResponse = require('../Utils/ErrorResponse')
const {NOT_FOUND,FORBIDDEN_REQUEST} = require('../Utils/httpConst')
const protect = (req,res,next)=>{
    let token
    console.log("i am here")
    console.log(req.headers)
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        next(new ErrorResponse("Token not found in header",FORBIDDEN_REQUEST))
    }
    next()
}

module.exports = protect