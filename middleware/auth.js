const ErrorResponse = require('../Utils/ErrorResponse')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const {NOT_FOUND,FORBIDDEN_REQUEST, NOT_AUTHENTICATED} = require('../Utils/httpConst')

exports.protect = async(req,res,next)=>{
    let token
    console.log("i am here")
    console.log(req.headers)
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        next(new ErrorResponse("Token not found in header",FORBIDDEN_REQUEST))
    }

    try{        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id)
        next()
    }
    catch(err){
        return next(new ErrorResponse('Not authorized to access this route', NOT_AUTHENTICATED));
    }
}

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorResponse(
            `User role ${req.user.role} is not authorized to access this route`,
            FORBIDDEN_REQUEST
          )
        );
      }
      next();
    };
  };
