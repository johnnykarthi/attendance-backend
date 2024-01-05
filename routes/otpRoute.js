const express = require('express')

const router = express.Router()

const {generateOTP,validateOTP} = require('../controllers/OtpController')



// Router

router.post('/generate-otp',generateOTP)

router.post('/validate-otp',validateOTP)

module.exports = router
