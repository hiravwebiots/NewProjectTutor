const mongoose = require('mongoose')

const emailTemplateSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    subject : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    }
},{
    timestamps : true   
    }
)

const emailTemplateModel = mongoose.model('emailTemplate', emailTemplateSchema)
module.exports = emailTemplateModel