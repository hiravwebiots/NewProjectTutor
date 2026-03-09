const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },

    type : {
        type : String,
        required : true,
        enum : ['student', 'tutor', 'admin']
    }
},
    {
        timestamps : true
    }   
)

const roleModel = mongoose.model('role', roleSchema)
module.exports = roleModel