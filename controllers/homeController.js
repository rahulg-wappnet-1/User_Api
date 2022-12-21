const {success, failed} = require('../utils/response')
exports.home  = async(req,res) =>{
    success(res,'home route');
}