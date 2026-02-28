const userModel = require('../model/userModel')
const courseModel = require('../model/courseModel')
const fs = require('fs')
const path = require('path')

const updateProfile = async (req, res) => {
    try{

        const userId = req.user.id;

        const { name, phone, interestOfField, bio, experience, qualification } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 0, message: "User not found" });
        }

        // ==== student update ====
        if (user.role === "student") {
            if (interestOfField) user.interestOfField = interestOfField;
        }

        // ==== tutor update ====
        if (user.role === "tutor") {
            // if profile in pending then not updated this
            if(user.approvalStatus === 'pending'){
                return res.status(400).json({ status : 0, message : "Profile cannot be updated while approval is pending" })
            }
        
            if (bio) user.bio = bio;
            if (experience) user.experience = experience;
            if (qualification) user.qualification = qualification;

            // ==== degree uploaded handel ===
            if (req.file){
                if(user.approvalStatus === 'approved'){
                    return res.status(400).json({ status : 0, message : "Approved tutor cannot change degree certificate" })
                }
            }

            // if it's rejected
            if(user.degreeCertificate){
                const oldPath = path.join('uploads/degree', user.degreeCertificate)
                if(fs.existsSync(oldPath)){
                    fs.unlink(oldPath)
                }
            }

            // save new degree
            user.degreeCertificate = req.file.filename

            // If rejected and re-uploaded degree → send to pending
            if (user.approvalStatus === "rejected") {
                user.approvalStatus = "pending";
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

        if(user.role === "tutor"){
            const filePath = path.join('uploads/degree', user.degreeCertificate)
            if(fs.existsSync(filePath)){
                fs.unlink(filePath)
            }
            
            const deleteCourse = await courseModel.findByIdAndDelete({ tutorId : userId })
        }

        res.status(200).json({ status: 1, message: "Account deleted successfully" });

    } catch (err) {
        res.status(500).json({ status: 0, message: "Error while deleting account" });
    }
};


module.exports = { updateProfile, deleteProfile }