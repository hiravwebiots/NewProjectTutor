const express = require('express')
const { createRole, readAllRole, updateRole, deleteRole, readRoleByName } = require('../controller/roleController')
const { checkAuthentication, checkRole } = require('../middleware/auth')
const routes = express()

routes.post('/create', checkAuthentication, checkRole('admin'), createRole)
// GET /users/read?role=student
routes.get('/read', checkAuthentication, checkRole('admin'), readRoleByName)
routes.get('/read', checkAuthentication, checkRole('admin'), readAllRole)
routes.put('/update/:id', checkAuthentication, checkRole('admin'), updateRole)
routes.delete('/delete/:id', checkAuthentication, checkRole('admin'), deleteRole)

module.exports = routes