const express = require('express')
const { checkAuthentication, checkRole } = require('../middlewares/auth')
const { createRolePermission, readRolePemission, readRolesAllPermission, updateRolePemission } = require('../controllers/rolePermissionController')
const routes = express()

routes.post('/create', checkAuthentication, checkRole('admin'), createRolePermission)
routes.get('/read', checkAuthentication, checkRole('admin'), readRolePemission)
routes.get('/read/:id', checkAuthentication, checkRole('admin'), readRolesAllPermission)
routes.put('/update/:id', checkAuthentication, checkRole('admin'), updateRolePemission)

module.exports = routes