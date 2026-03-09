const express = require('express')
const { signupUser, loginUser } = require('../controllers/authController')
const { uploadDegree } = require('../middlewares/fileUpload')
const routes = express.Router()

// ========== SIGNUP ===============
routes.post('/signup', uploadDegree.single('degreeCertificate'), signupUser)




// ========== LOGIN ===============
// render login page

// Logim API
routes.post('/login', loginUser)


module.exports = routes
