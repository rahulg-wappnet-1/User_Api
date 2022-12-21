const user = require('../models/user')
const jwt = require('jsonwebtoken')
const { missing, forbidden } = require('../utils/response')

exports.isLoggedIn = async(req,res,next) =>{
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ","")

    if(!token){
        return next(missing(res,`Login first to access this page`))
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await user.findById(decoded.id)
    next();
}

exports.customRoles = (...roles) =>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(forbidden(res,`You are not authorized`))
        }
        next();
    }
}
