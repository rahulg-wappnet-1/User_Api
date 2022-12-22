const router = require('express').Router()
const {home} = require('../controllers/homeController')
//test
router.route('/').get(home)

module.exports = router