const cloudinary = require('cloudinary')
const User = require('../models/user');

//creates the image public id array
exports.imageArrayMaker =async (req,res,next) =>{
    const imageArray = []
    for(let i=0;i<req.files.photos.length;i++){
        let result = cloudinary.v2.uploader.upload(
            req.files.photos[i].tempFilePath,{
                folder: 'documents'
            }
        );
        imageArray.push(
            (await result).public_id
        )
    }
    return imageArray;
}

//creates object required to update document with file 
exports.updateUserService = async(req,res,next,index,photo_id,card_type)=>{
    const filter = {email:req.user.email}
    const{unique_id,file_available} = req.body
    const newData = {}
    if(card_type === 'adhar_card'){
        newData.adhar_card ={
            unique_id:unique_id[index],
            file_available:file_available[index],
            photo_id:photo_id
        } 
       
        this.updateUserFileQuery(filter,newData)
    }else if(card_type === 'pan_card'){
        newData.pan_card ={
            unique_id:unique_id[index],
            file_available:file_available[index],
            photo_id:photo_id
        } 
        this.updateUserFileQuery(filter,newData)      
    }else if(card_type==='passport'){
        newData.passport ={
            unique_id:unique_id[index],
            file_available:file_available[index],
            photo_id:photo_id
        } 
       this.updateUserFileQuery(filter,newData)
    }
}

//Creates object required to update document without file 
exports.updateUserServiceWithoutFile = async(req,res,next,index,card_type) =>{
    const filter = await {email:req.user.email}
    const{unique_id,file_available} = req.body
    const newData = {}
    if(card_type == 'adhar_card'){
        newData.adhar_card = {
            unique_id:unique_id[index],
            file_available:file_available[index],
            photo_id:'Not available'
        }
        this.updateUserFileQuery(filter,newData)
    }else if(card_type === 'pan_card'){
        newData.pan_card = {
            unique_id:unique_id[index],
            file_available:file_available[index],
            photo_id:'Not available'
        }
        this.updateUserFileQuery(filter,newData)
    }else if(card_type === 'passport'){
        newData.passport = {
            unique_id:unique_id[index],
            file_available:file_available[index],
            photo_id:'Not available'
        }
        this.updateUserFileQuery(filter,newData)
    }
}

//Function to update documents of user model 
//Query used :- findOneAndUpdate
exports.updateUserFileQuery = async (filter,newData) =>{
    let user = await User.findOneAndUpdate(filter,newData,{
        returnOriginal:false
    })
    return user
}
