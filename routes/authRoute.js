const express = require('express')
const router = express.Router()
const { registrationUser, getPrivateData, sendOtp, login } = require('../controllers/authController')
const checkAccess = require('../middleware/authMiddleware')

// routes
router.post('/registration', registrationUser)
router.post('/sendotp', sendOtp)
router.post('/login', login)
router.get('/private',checkAccess, getPrivateData)

module.exports = router