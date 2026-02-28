const nodemailer = require('nodemailer')
const handlebars = require('handlebars')

let transport = nodemailer.createTransport({
    host : process.env.EMAIL_HOST,
    post : process.env.EMAIL_PORT,
    secure : false,         // true for : 465, false : 587  
    auth : {
        user : process.env.EMAIL_ADMIN,
        pass : process.env.EMAIL_PASS
    }
})

transport.verify((err, success) => {
    if(err){
        console.log('SMTP Error : ', err);
    } else{
        console.log('SMTP Server is ready');
    }
})

// ==== send email function ====
const sendEmail = async (to, subject, templateContent, data) => {
    try{
        const compileTemplate =  handlebars.compile(templateContent)
        const html = compileTemplate(data)

        const info = await transport.sendMail({
            from : process.env.EMAIL_ADMIN,
            to,
            subject,
            html
        })
    } catch(err){
        console.log('Send email error', err);
    }
}

module.exports = sendEmail