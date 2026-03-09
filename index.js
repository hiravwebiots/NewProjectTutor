const express = require('express')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const connectDB = require("./config/db")
const path = require('path')
const cookieParser = require('cookie-parser')

// routes 
const authRoutes = require('./routes/authRoutes')
const tutroStatusRoutes = require('./routes/checkStatusRoutes')
const emaulTemplate = require('./routes/emailTemplateRoutes')
const otpRoutes = require('./routes/otpRoutes')
const profile = require('./routes/profileRoutes')
const course = require('./routes/courseRoutes')
const tutorReapplyRoutes = require('./routes/tutorReapplyOtpRoutes')
const roleRoutes = require('./routes/roleRoutes')
const rolePermission = require('./routes/rolePermissionRoutes')
const demoRoutes = require('./routes/demoRoutes')

connectDB()
const app = express()


// This allows EJS form data → req.body
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())

// use for save files 
app.use('/uploads', express.static('uploads'))

// ----------------- View & Assets -----------------
app.set('view engine', 'ejs')    // ejs set in views folder
app.set('views', path.join(__dirname, 'views'))


// appending static files and parsers
app.use(express.static(path.join(__dirname, 'public')))



// =============== EJS Pages ==========================================================
const roleModel = require('./models/roleModel')
const { verifyToken } = require('./middlewares/auth')

// render signup page
app.get('/signup', async (req, res) => {

    const studentRole = await roleModel.findOne({ type: 'student' })
    const tutorRole = await roleModel.findOne({ type: 'tutor' })

    res.render('signup', {  
        studentRoleId: studentRole.id,
        tutorRoleId: tutorRole.id,
        error : null,
        message : null
    })
})

app.get('/login', (req, res) => {
    res.render('login', {error : null, message : null})
})


app.get('/dashboard', verifyToken, async (req, res) => {
    res.render('dashboard', {user : req.user})
})
// =====================================================================================

// Routes
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