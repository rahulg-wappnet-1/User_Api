
require('dotenv').config();

//response for status code 200
exports.success = (res,message) =>{
    res.status(200).json({
        message: `${message}`
    })
}

//response for status code 501
exports.failed = (res,message) =>{
    res.status(501).json({
        message:`${message}`
    })
}

//response for status code 401
exports.missing = (res,message) =>{
    res.status(401).json({
        message:`${message}`
    })
}

//response for status code 400
exports.invalid = (res,message) =>{
    res.status(400).json({
        message:`${message}`
    })
}

//response for status code 404
exports.notFound = (res,message) =>{
    res.status(404).json({
        message:`${message}`
    })
}

//response for status code 200
exports.success2 = (user,res) =>{
    res.status(200).json({
        name:user.name,
        email:user.email,
        role:user.role,
        secure_url: process.env.PHOTO_URL + user.photo.id
   })
}

//response for status code 403
exports.forbidden = (res,message) =>{
    res.status(403).json({
        message:`${message}`
    })
}