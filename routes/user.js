const router = require('express').Router()
const { signup, logIn, logOut, setRole, findUserByEmail, updateUser, deleteUser, addDocuments } = require('../controllers/userController')
const { isLoggedIn, customRoles } = require('../middlewares/user')

//all user routes
router.route('/signup').post(signup)
router.route('/login').post(logIn)
router.route('/logout').post(logOut)
router.route('/adddocuments').post(isLoggedIn,addDocuments)
router.route('/updateuser').put(isLoggedIn,updateUser)

//admin routes
router.route('/admin/setrole').put(isLoggedIn,customRoles('Admin'),setRole)
router.route('/admin/finduser').post(isLoggedIn,customRoles('Admin'),findUserByEmail)
router.route('/admin/deleteuser').delete(isLoggedIn,customRoles('Admin'),deleteUser)
router.route('/admin/updatedacumnets').post(isLoggedIn,customRoles('Admin'),addDocuments)


module.exports = router