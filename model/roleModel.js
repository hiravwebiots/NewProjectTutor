const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
    name : {
        type : String,
        require : true,
        unique : true
    },

    description : {
        type : String
    },

    isActive : {
        type : Boolean,
        default : true
    }
},
    {
    timestamps : true
    }   
)

const roleModel = mongoose.model('role', roleSchema)
module.exports = roleModel