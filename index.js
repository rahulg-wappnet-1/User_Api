const app = require('./app')
const connectWithDb = require('./config/db')
const cloudinary = require('cloudinary')
require('dotenv').config();

connectWithDb()

cloudinary.config({
    // cloud_name : process.env.CLODINARY_NAME, 
    // api_key:process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLODINARY_API_SECRET

    cloud_name : 'codersstay',
    api_key : '245156686657848',
    api_secret : 'aVxXZ5QjeqqShsbGplOaVSE_WqA'
 })

app.listen(process.env.PORT , () =>{
    console.log(`Server listening at port:- ${process.env.PORT}`);
})