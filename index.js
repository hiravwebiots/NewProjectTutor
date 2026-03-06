const express = require('express')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const loginRoutes = require('./routes/loginRoutes')
const tutroStatusRoutes = require('./routes/checkStatusRoutes')
const connectDB = require("./config/db")
const emaulTemplate = require('./routes/emailTemplateRoutes')
const otpRoutes = require('./routes/otpRoutes')
const profile = require('./routes/profileRoutes')
const course = require('./routes/courseRoutes')
const tutorReapplyRoutes = require('./routes/tutorReapplyOtpRoutes')
const roleRoutes = require('./routes/roleRoutes')
const rolePermission = require('./routes/rolePermissionRoutes')

const app = express()
connectDB()

app.use(express.json())
app.use(express.urlencoded())
// app.use(bodyParser.json())

app.use('/api/user', loginRoutes)
app.use('/api/email-template', emaulTemplate)
app.use('/api/login', otpRoutes)
app.use('/api/tutor-status', tutroStatusRoutes)
app.use('/api/user/profile', profile)
app.use('/api/tutor/course', course)
app.use('/api/tutor/reapply', tutorReapplyRoutes)
app.use('/api/role', roleRoutes)
app.use('/api/rolepermission', rolePermission)

app.listen(PORT, () => {
    console.log(`Server run on port no.${PORT}`);
})