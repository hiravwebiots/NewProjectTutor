const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    roleId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'role',
        require : true
    },

    // role: {
    //     type: String,
    //     enum: ["student", "tutor", "admin"],
    //     default: "student"
    // },

    // student-only fields
    interestOfField : {
        type : String
    },

    // Tutor-only fields
    bio: {
        type: String
    },

    experience: {
        type: String
    },

    qualification: {
        type: String
    },

    degreeCertificate: {
        type : String       // File Path
    },

    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        // default: "pending"
    },

    rejectionReason : {
        type : String
    }

}, { timestamps: true });


const userModel = mongoose.model("user", userSchema);
module.exports = userModel