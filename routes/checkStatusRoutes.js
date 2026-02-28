const express = require('express')
const { checkTutorStatus, updateTutorStatus } = require('../controller/tutorStatusController')
const { checkRole, checkAuthentication } = require('../middleware/auth')
const routes = express()

// Check Pendding Tutors
routes.get('/pendding', checkAuthentication, checkRole('admin'), checkTutorStatus)


routes.put('/update/:id', checkAuthentication, checkRole('admin'), updateTutorStatus)

module.exports = routes