const express = require('express')
const { addCourse, getCourse, updateCourse, deleteCourse, getSelfCourse } = require('../controller/courseController')
const { checkAuthentication, checkRole } = require('../middleware/auth')
const { uploadCourseFiles } = require('../middleware/fileUpload')
const routes = express()

routes.post('/create', checkAuthentication, checkRole(['admin', 'tutor']), uploadCourseFiles.fields([
                                                                                    { name : 'video', maxCount : 1 },
                                                                                    { name : 'material', maxCount : 1 }
                                                                                ]),addCourse)

routes.get('/get', checkAuthentication, checkRole(['admin', 'tutor', 'student']), getCourse)

// tutor's self course
routes.get('/get/selfcourse', checkAuthentication, checkRole('tutor'), getSelfCourse)

routes.put('/update/:id', checkAuthentication, checkRole(['admin', 'tutor']), updateCourse)
routes.delete('/delete/:id', checkAuthentication, checkRole(['admin', 'tutor']), deleteCourse)

module.exports = routes

    // "course_create",
    // "course_view",
    // "course_view_self",
    // "course_update",
    // "course_delete"