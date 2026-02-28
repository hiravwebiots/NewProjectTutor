const userModel = require('../model/userModel')
const otpModel = require('../model/otpModel')
const emailTemplateModel = require('../model/emailTemplateModel')

const sendOtp = async(req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(400).json({ status : 0, message : "user not found while send otp" })
        }

        // ==== Generate 6 Digit OTP =====
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // ==== Delete old OTP if exists ====
        await otpModel.deleteMany({ userId : user.id }) 

        // ==== Save OTP in otp collection ====
        const otpData = new otpModel({
            userId : user._id,
            email : user.email,
            otp : otp,
            isOtpVerified : false
        })
        await otpData.save()

        otpData.otpExpire = Date.now() + 5 * 60 * 1000;
        
        // ==== Find Email Template ====
        const template = await emailTemplateModel.findOne({ title : "Send OTP for Forgot Password" })
        if(!template){
            return res.status(500).json({ status : 0, message : "Template not found" })
        }

        if(template){
            await sendEmail(
                user.email,
                template.subject,       
                template.content,
                {
                    otp : otpData.otp
                }
            )
        }
        res.status(200).json({ status : 1, message : "otp sent to email" })
    } catch(err){
        console.log(err);
        res.status(500).json({ status: 0, message: "Error while sending OTP", err });
    }
}

const verifyOtp = async (req, res) => {
    try{
        const { email, otp } = req.body

        // ==== Find OTP Record ====
        const otpData = await otpModel.findOne({ 
            email : email,
            otp : otp
         })

         if(!otpData){
            return res.status(400).json({ status : 0, message : "Invalid OTP"})
         }

        // ==== Check expiry ====
        if (otpData.expireAt && otpData.expireAt < Date.now()) {
            return res.status(400).json({ status: 0, message: "OTP expired" })
        }

        // otp remove or null when use otp = null
        // user.otp = null
        // user.otpExpire = null;
 
        otpData.isOtpVerified = true;

        await otpData.save();
        res.json({ status: 1, message: "OTP verified successfully" })

    } catch(err){
        console.log(err);
        res.status(500).json({ status: 0, message: "Error verifying OTP" });
    }
}

const forgotPassword = async (req, res) => {
    try{
        const { email, newPassword } = req.body

        // ==== Find User Record ====
        const user = await userModel.findOne({ email })

        // ==== Find OTP Record ====
        const otp = await otpModel.findOne({ email : email })

        if(otp.isOtpVerified !== true){
            return res.status(400).send({ status : 0, message : "Please first Verified the OTP"})
        }

        const hashPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashPassword
        otp.isOtpVerified = false;
        await user.save()
        await otp.save()

        res.status(200).send({ status : 1, message : "Password forgot successfully" })

    } catch(err){
        console.log(err);
        res.status(500).send({ status : 0, message : "error forgot Password", error : err})
    }
}



module.exports = { sendOtp, verifyOtp, forgotPassword }