const express = require('express')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const authRoutes = require('./routes/authRoutes')
const tutroStatusRoutes = require('./routes/checkStatusRoutes')
const connectDB = require("./config/db")
const emaulTemplate = require('./routes/emailTemplateRoutes')
const otpRoutes = require('./routes/otpRoutes')
const profile = require('./routes/profileRoutes')
const course = require('./routes/courseRoutes')
const tutorReapplyRoutes = require('./routes/tutorReapplyOtpRoutes')
const roleRoutes = require('./routes/roleRoutes')
const rolePermission = require('./routes/rolePermissionRoutes')
const demoRoutes = require('./routes/demoRoutes')

const app = express()
connectDB()

app.use(express.json())

// want to open the file in the browser, then you need:
app.use('/uploads', express.static('uploads'))

//use for the form-data 
app.use(express.urlencoded())   

// ejs set in views folder
app.set('view engine', 'ejs')

// Static file -- public folder
app.use('/public', express.static('public'))

// =============== EJS Pages ===============
const roleModel = require('./model/roleModel')
// render signup page
app.get('/signup', async (req, res) => {

    const studentRole = await roleModel.findOne({ type: 'student' })
    console.log("🚀 ~ studentRole:", studentRole)
    const tutorRole = await roleModel.findOne({ type: 'tutor' })

    res.render('signup', {
        studentRoleId: studentRole.id,
        tutorRoleId: tutorRole.id
    })
})
 
// render login page
app.get('/login', (req, res) => {
    res.render('login')
})


// ===== API Routes =====
app.use('/api/user', authRoutes)
app.use('/api/email-template', emaulTemplate)
app.use('/api/login', otpRoutes)
app.use('/api/tutor-status', tutroStatusRoutes)
app.use('/api/user/profile', profile)
app.use('/api/tutor/course', course)
app.use('/api/tutor/reapply', tutorReapplyRoutes)
app.use('/api/role', roleRoutes)
app.use('/api/rolepermission', rolePermission)
app.use('/api', demoRoutes)

app.listen(PORT, () => {
    console.log(`Server run on port no.${PORT}`);
})