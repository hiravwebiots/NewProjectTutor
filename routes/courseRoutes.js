const express = require('express')
const { addCourse, getCourse, updateCourse, deleteCourse } = require('../controller/courseController')
const { checkAuthentication, checkRole } = require('../middleware/auth')
const { uploadVideo } = require('../middleware/fileUpload')
const routes = express()

routes.post('/create', checkAuthentication, checkRole('admin', 'tutor'), uploadVideo.single('video'), addCourse)
routes.get('/get', checkAuthentication, checkRole('admin', 'tutor', 'student'), getCourse)
routes.put('/update/:id', checkAuthentication, checkRole('admin', 'tutor'), uploadVideo.single('video'), updateCourse)
routes.delete('/delete/:id', checkAuthentication, checkRole('admin', 'tutor'), deleteCourse)

module.exports = routes