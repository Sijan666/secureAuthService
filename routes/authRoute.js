const express = require('express')
const router = express.Router()
const { registrationUser, loginUser, verifyLogin, getPrivateData } = require('../controllers/authController')
const checkAccess = require('../middleware/authMiddleware')

// routes
router.post('/registration', registrationUser)
router.post('/sendotp', loginUser)
router.post('/login', verifyLogin)
router.get('/private',checkAccess, getPrivateData)

module.exports = router