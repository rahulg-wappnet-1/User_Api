const router = require('express').Router()
const { signup, logIn, logOut, setRole, findUserByEmail, updateUser, deleteUser } = require('../controllers/userController')
const { isLoggedIn, customRoles } = require('../middlewares/user')

router.route('/signup').post(signup)
router.route('/login').post(logIn)
router.route('/logout').post(logOut)

router.route('/admin/setrole').put(isLoggedIn,customRoles('Admin'),setRole)
router.route('/admin/finduser').post(isLoggedIn,customRoles('Admin'),findUserByEmail)
router.route('/admin/deleteuser').delete(isLoggedIn,customRoles('Admin'),deleteUser)

router.route('/updateuser').put(isLoggedIn,updateUser)


module.exports = router