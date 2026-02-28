const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
    tutorId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    descriptopm : {
        type : String
    },
    // thumbnil : {

    // },
    video : {
        type : String
    },
    price : {
        type : Number
    },
    category : {
        type : String
    }
},{
    timestamps : true
    }
)   

const courseModel = mongoose.model('course', courseSchema)
module.exports = courseModel