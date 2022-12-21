const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const connectWithDb = () =>{
    mongoose.
    connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log(`Database connected `))
    .catch(error =>{
        console.log(`Db connnection failed`)
        console.log(error)
        process.exit(1)
    })
}

module.exports = connectWithDb