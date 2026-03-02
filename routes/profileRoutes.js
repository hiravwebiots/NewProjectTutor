const express = require('express')
const { checkAuthentication, checkRole } = require('../middleware/auth')
const { updateProfile, deleteProfile, getAllProfile } = require('../controller/profileController')
const { uploadDegree, uploadPdf } = require('../middleware/fileUpload')
const routes = express()

// get all profile by admin
routes.get('/', checkAuthentication, checkRole('admin'), getAllProfile)

// update profile
routes.put('/update', checkAuthentication, checkRole(['tutor', 'student']), uploadDegree.single('degreeCertificate'), uploadPdf.single('material'), updateProfile)

// profile upate and delete by 
routes.delete('/delete', checkAuthentication, deleteProfile)

// tutor and student profile delete by admin
routes.delete('/delete/:id', checkAuthentication, checkRole('admin'))

module.exports = routes