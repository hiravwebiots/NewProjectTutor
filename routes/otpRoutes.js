const express = require('express')
const { sendOtp, verifyOtp, forgotPassword } = require('../controller/otpController')
const routes = express()

routes.post('/sendotp', sendOtp)
routes.post('/verifyotp', verifyOtp)
routes.post('/forgotpassword', forgotPassword)

module.exports = routes