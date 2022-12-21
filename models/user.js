const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//user model
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,`Please provide the name`],
        maxlength: [30, `Name should be under 30  characters`]
    },
    role:{
        type:String,
        default:`user`
    },
    
    email:{
        type: String,
        required: [true, `Please enter the email`],
        validate : [validator.isEmail, `Please enter email in correct format`],
        unique : true
    },
    password:{
        type:String,
        required:[true,`Please enter the password`],
        select:false
    },
    photo:{
        id:{
            type: String,
            required: true
        }
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    forgotPasswordToken : String,
    forgotPasswordTokenExpiry : String,

})

//using pre hook
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
})


//method to genrate jwt token
userSchema.methods.getJwtToken =  function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRY
    })
}



userSchema.methods.isValidatedPassword = async function(userSentPassword,User){
    return await bcrypt.compare(userSentPassword, this.password);
};
module.exports = mongoose.model("User",userSchema)