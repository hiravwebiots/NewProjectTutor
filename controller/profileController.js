const userModel = require('../model/userModel')
const courseModel = require('../model/courseModel')
const fs = require('fs')
const path = require('path')
const roleModel = require('../model/roleModel')

const getAllProfile = async (req, res) => {
    try{
        const adminRole = await roleModel.findOne({ name : 'admin' })

        const users = await userModel.find({ role : { $ne : adminRole.id } }).select('-password').populate('role')
        res.status(200).json({ status : 1, message : "Get All user by admin", data : users})
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while get all user profile by admin" })
    }
}

// get selfProfile
const getSelfProfile = async (req, res) => {
    try{
        const userId = req.user.id

        const user = await userModel.findById(userId).select('-password').populate('role', 'name')
        if(!user){
            return res.status(400).json({ status : 0, message : "user not found" })
        }

        res.status(200).json({ status : 1, message : "profile details fetched", data : user})
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while getting Self Profile" })
    }
}

const updateProfile = async (req, res) => {
    try{

        const userId = req.user.id;

        const { name, phone, interestOfField, bio, experience, qualification } = req.body;

        const user = await userModel.findById(userId).select('-password').populate('role')
        if (!user) {
            return res.status(404).json({ status: 0, message: "User not found" });
        }

        // ==== student update ====
        if (user.role.name === "student") {
            if (interestOfField) user.interestOfField = interestOfField;
        }

        // ==== tutor update ====
        if (user.role.name === "tutor") {
            // if profile in pending then not updated this
            if(user.approvalStatus === 'pending'){
                return res.status(400).json({ status : 0, message : "Profile cannot be updated while approval is pending" })
            }
            
            if(user.approvalStatus === 'rejected'){
                return res.status(400).json({ status : 0, message : "Please Reapply for the tutor" })
            }

            // if status == "approved"
            if (bio) user.bio = bio;
            if (experience) user.experience = experience;
            if (qualification) user.qualification = qualification;

            // new File uploaded
            if (req.file){
                // ==== degree uploaded : it's approved then can't change ===
                if(user.approvalStatus === 'approved'){
                    return res.status(400).json({ status : 0, message : "Approved tutor cannot change degree certificate" })
                }

                // if(user.approvalStatus === 'rejected'){
                //     if(user.degreeCertificate && fs.existsSync(user.degreeCertificate)){
                //         fs.unlink(user.degreeCertificate)
                //     }
                // }

                // If rejected and re-uploaded degree → send to pending
                // if (user.approvalStatus === "rejected") {
                //     user.approvalStatus = "pending";
                // }
            }   
        }

        // === common filed ===
        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();

        res.status(200).json({ status: 1, message: "Profile updated successfully", data: user });

    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while update profile" })
    }
}

const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 0, message: "User not found" });
        }

        if(user.role === 'admin'){
            return res.status(200).json({ status : 0, message : "admin can't delete the account" })
        }

        // only for tutor
        if(user.role === "tutor"){
            
            // delete tutor degree file
            const filePath = path.join('uploads/degree', user.degreeCertificate)
            if(fs.existsSync(filePath)){
                fs.unlink(filePath)
            }
            
            // delete only this tutors course 
            const deleteCourse = await courseModel.deleteMany({ tutorId : userId })
        }

        // delete user account
        const deleteUser = await userModel.findByIdAndDelete(userId)

        res.status(200).json({ status: 1, message: "Account deleted successfully" });

    } catch (err) {
        res.status(500).json({ status: 0, message: "Error while deleting account" });
    }
};

module.exports = { getAllProfile, getSelfProfile, updateProfile, deleteProfile }