const otpModel = require('../model/otpModel');
const userModel = require('../model/userModel')
const fs = require('fs')

const sendReapplyotp = async(req, res) => {
    try{
        const userId = req.user.id

        const user = await userModel.findById(userId).populate('role');
        if(!user || user.role.name !== "tutor"){
            return res.status(403).json({ status : 0, message : "Only tutor allowed" })
        }

        if(user.approvalStatus !== "rejected"){
            return res.status(400).json({ status : 0, message : "Only rejected tutor can reappply" })
        }

        const purpose = 'tutorReapply'

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        await otpModel.deleteMany({ userId, purpose })

        const otpData = new otpModel({
            userId,
            email : user.email,
            otp,
            purpose,
            isOtpVerified : false,
        })
        otpData.otpExpire = Date.now() + 5 * 60 * 1000;
        await otpData.save()


        // ==== Find Email Template ====
        const template = await emailTemplateModel.findOne({ title : "Reapply Profile" })
        if(!template){
            return res.status(500).json({ status : 0, message : "Template not found" })
        }

        if(template){
            await sendEmail(
                user.email,
                template.subject,       
                template.content,
                {
                    name : user.name,
                    otp : otpData.otp
                }
            )
        }
        res.status(200).json({ status : 1, message : "otp sent to email" })
    } catch(err){   
        console.log(err);
        res.status(500).json({ status : 0, message : "error while send re-apply otp", err})
    }
}

const verifyReapplyOtp = async(req, res) => {
    try{
        const userId = req.user.id
        const { otp } = req.body

        const purpose = 'tutorReapply'

        const otpData = await otpModel.findOne({
            userId,
            otp,
            purpose
        })

        if(!otpData){
            return res.status(400).json({ status : 0, message : "Invalid OTP" })
        }

        if(otpData.otpExpire < Date.now()){
            return res.status(400).json({ status : 0, message : "Otp expired" })
        }

        otpData.isOtpVerified = true
        await otpData.save()

        res.status(200).json({ status : 1, message : "OTP Verified" })

        // after verification delete otp

    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while verify re-apply otp", err})
    }
}

const reapplyTutor = async(req, res) => {
    try{
        const userId = req.user.id

        const user = await userModel.findById(userId).populate('role')

        if(!user || user.role.name !== "tutor"){
            return res.status(400).json({ status : 0, message : "only tutor allowed" })
        }

        if(user.approvalStatus !== 'rejected'){
            return res.status(400).json({ status : 0, message : "not eligible for reapply" })
        }

        const otpData = await otpModel.findOne({
            userId,
            purpose :'tutorReapply',
            isOtpVerified : true
        })

        if(!otpData){
            return res.status(400).json({ status : 0, message : 'Please, Verify the otp' })
        }

        if(!req.file){
            return res.status(400).json({ status : 0, message : "Degree Certificate Required" })
        }


        // Delete old rejected certificate
        if (user.degreeCertificate && fs.existsSync(user.degreeCertificate)) {
            fs.unlinkSync(user.degreeCertificate);
        }
        user.degreeCertificate = req.file.path;

        user.approvalStatus = "pending";

        await user.save();

        // Delete OTP after successful reapply
        await otpModel.deleteMany({ userId, purpose: "tutorReapply" });

        res.status(200).json({ status: 1, message: "Reapplied successfully. Waiting for admin approval." });


    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while re-aaply tutor" , err})
    }
}


module.exports = { sendReapplyotp, verifyReapplyOtp, reapplyTutor}


