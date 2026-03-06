const express = require('express')
const { checkAuthentication, checkRole } = require('../middleware/auth')
const { sendReapplyotp, verifyReapplyOtp, reapplyTutor } = require('../controller/tutorReapplyOtpController')
const { uploadDegree } = require('../middleware/fileUpload')
const routes = express()

routes.post('/send-otp', checkAuthentication, checkRole('tutor'), sendReapplyotp)
routes.post('/verify-otp', checkAuthentication, checkRole('tutor'), verifyReapplyOtp)
routes.post('/profile', checkAuthentication, checkRole('tutor'), uploadDegree.single('degreeCertificate'), reapplyTutor)

    // "send_reapply_otp",
    // "verify_reapply_otp",
    // "tutor_reapply_profile",


module.exports = routes;