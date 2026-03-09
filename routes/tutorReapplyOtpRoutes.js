const express = require('express')
const { checkAuthentication, checkRole } = require('../middlewares/auth')
const { sendReapplyotp, verifyReapplyOtp, reapplyTutor } = require('../controllers/tutorReapplyOtpController')
const { uploadDegree } = require('../middlewares/fileUpload')
const checkRolePermission = require('../middlewares/checkRolePermission')
const routes = express()

routes.post('/send-otp', checkAuthentication, checkRole('tutor'), sendReapplyotp)
routes.post('/verify-otp', checkAuthentication, checkRole('tutor'), verifyReapplyOtp)
routes.post('/profile', checkAuthentication, checkRolePermission('tutor_reapply_profile'), uploadDegree.single('degreeCertificate'), reapplyTutor)

    // "send_reapply_otp",
    // "verify_reapply_otp",
    // "tutor_reapply_profile",


module.exports = routes;