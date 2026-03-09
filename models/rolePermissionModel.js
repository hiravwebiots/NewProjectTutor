const mongoose = require('mongoose')

const roleHasPemission = mongoose.Schema({
    RoleId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'role',
        required : true
    },
    PermissionId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "permission",
        required : true
    }
},{
    timestamp : true
})

const rolePemissionModel = mongoose.model('rolePermission', roleHasPemission)
module.exports = rolePemissionModel