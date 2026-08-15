const express = require('express');
const router = express.Router();
const checkAccess = require('../middleware/authMiddleware');
const { registrationUser, loginUser, getPrivateData } = require('../controllers/authController'); 

router.post('/registration', registrationUser);
router.post('/login', loginUser);
router.get("/privatedata", checkAccess, getPrivateData);

module.exports = router;

module.exports = router