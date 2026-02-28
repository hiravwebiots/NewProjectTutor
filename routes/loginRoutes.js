const express = require('express')
const { signupUser, loginUser } = require('../controller/loginController')
const { uploadDegree } = require('../middleware/fileUpload')
const routes = express()

routes.post('/signup', uploadDegree.single('degreeCertificate'), signupUser)
routes.post('/login', loginUser)



module.exports = routes
