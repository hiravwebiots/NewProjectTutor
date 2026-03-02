const express = require('express')
const { addCourse, getCourse, updateCourse, deleteCourse, getSelfCourse } = require('../controller/courseController')
const { checkAuthentication, checkRole } = require('../middleware/auth')
const { uploadVideo, uploadPdf } = require('../middleware/fileUpload')
const routes = express()

routes.post('/create', checkAuthentication, checkRole(['admin', 'tutor']), uploadVideo.single('video'), addCourse)
routes.get('/get', checkAuthentication, checkRole(['admin', 'tutor', 'student']), getCourse)

// tutor's self course
routes.get('/get/selfcourse', checkAuthentication, checkRole('tutor'), getSelfCourse)

routes.put('/update/:id', checkAuthentication, checkRole(['admin', 'tutor']), uploadVideo.single('video'), uploadPdf.single('material'), updateCourse)
routes.delete('/delete/:id', checkAuthentication, checkRole(['admin', 'tutor']), deleteCourse)

module.exports = routes