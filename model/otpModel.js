const mongoose = require('mongoose')

const otpScheama = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true
    },
    otp : {
        type : String,
        default : null
    },

    otpExpire : {
        type : String,
        default : null
    },

    isOtpVerified : {
        type : String,
        default : null
    }
},  {
        timestamps : true
    }
)

const otpModel = mongoose.model('otplpg', otpScheama)
module.exports = otpModel