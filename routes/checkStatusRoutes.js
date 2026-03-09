const express = require('express')
const { checkTutorStatus, updateTutorStatus } = require('../controllers/tutorStatusController')
const { checkRole, checkAuthentication } = require('../middlewares/auth')
const routes = express()

// Check Pendding Tutors
routes.get('/pendding', checkAuthentication, checkRole('admin'), checkTutorStatus)

// update status
routes.put('/update/:id', checkAuthentication, checkRole('admin'), updateTutorStatus)

module.exports = routes

