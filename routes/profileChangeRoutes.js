const express = require('express')
const { checkAuthentication, checkRole } = require('../middleware/auth')
const { updateProfile, deleteProfile } = require('../controller/profileChangeController')
const { uploadDegree } = require('../middleware/fileUpload')
const routes = express()

// update profile
routes.put('/update/:id', checkAuthentication, checkRole('tutor', 'student'), uploadDegree.single('degreeCertificate'), updateProfile)

// profile upate and delete by 
routes.delete('/delete/:id', checkAuthentication, deleteProfile)

module.exports = routes