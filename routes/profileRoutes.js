const express = require('express')
const { checkAuthentication, checkRole } = require('../middlewares/auth')
const { updateProfile, deleteProfile, getAllProfile, getSelfProfile } = require('../controllers/profileController')
const { uploadDegree } = require('../middlewares/fileUpload')
const routes = express()

// get all profile by admin
routes.get('/all', checkAuthentication, checkRole('admin'), getAllProfile)

routes.get('/self', checkAuthentication, getSelfProfile)

// update profile
routes.put('/update', checkAuthentication, checkRole(['tutor', 'student']), uploadDegree.single('degreeCertificate'), updateProfile)

// profile delete 
routes.delete('/delete', checkAuthentication, deleteProfile)

// tutor and student profile delete by admin
routes.delete('/delete/:id', checkAuthentication, checkRole('admin'))

module.exports = routes


    // "profile_update"