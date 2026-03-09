const express = require('express')
const { createTemplate, readTemplate, updateTemplate, deleteTemplate } = require('../controllers/emailTemplateController')
const { checkAuthentication, checkRole } = require('../middlewares/auth')
const routes = express()

routes.post('/create', checkAuthentication, checkRole('admin'), createTemplate)
routes.get('/read', checkAuthentication, checkRole('admin'), readTemplate)
routes.put('/update/:id', checkAuthentication, checkRole('admin'), updateTemplate)
routes.delete('/delete/:id', checkAuthentication, checkRole('admin'), deleteTemplate)

module.exports = routes