const express = require('express')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParse = require('cookie-parser')
const fileupload = require('express-fileupload')
const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParse())
app.use(morgan('tiny'))

app.use(bodyParser.urlencoded ({extended:true}))
app.use(fileupload({
    useTempFiles: true,
    tempFilePath: "/temp/"
})
);




const home = require('./routes/home')
const user = require('./routes/user')
app.use('/api/v1/',home)
app.use('/api/v1/user',user)
module.exports = app 