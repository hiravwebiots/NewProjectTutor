const express = require('express')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const loginRoutes = require('./routes/loginRoutes')
const tutroStatusRoutes = require('./routes/checkStatusRoutes')
const connectDB = require("./config/db")
const emaulTemplate = require('./routes/emailTemplateRoutes')
const forgotPassword = require('./routes/otpRoutes')
const profile = require('./routes/profileChangeRoutes')
const course = require('./routes/courseRoutes')

const app = express()
connectDB()

app.use(express.json())
app.use('/api/user', loginRoutes)
app.use('/api/email-template', emaulTemplate)
app.use('/api/login', forgotPassword)
app.use('/api/tutor-status', tutroStatusRoutes)
app.use('/api/user/profile', profile)
app.use('/api/tutor/course', course)

app.listen(PORT, () => {
    console.log(`Server run on port no.${PORT}`);
})