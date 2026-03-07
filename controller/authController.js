const userModel = require('../model/userModel')
const roleModel = require('../model/roleModel');
const bcrypt = require("bcrypt");   
const jwt = require("jsonwebtoken");
// multer call or not here?

// Signup Student & tutor
const signupUser = async(req, res) => {
    try{
        const { name, email, password, phone, roleId, interestOfField, bio, experience, qualification } = req.body
        // degreeCertificate in file

        // == required filed
        if(!name || !email || !password || !phone || !roleId){
            return res.status(400).json({ status : 0, message : "Required Filled Missing" })
        }

        // ===== email validaton =====
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;     
        if(!emailRegex.test(email)){
            return res.status(400).json({ status : 0, message : "Invalid email formate" })
        }

        // ==== email already exist ====
        const existUser = await userModel.findOne({ email })
        if(existUser){
            return res.status(400).json({ status : 0, message : "Email already registered" })
        }

        // ==== phone validation ====
        const phoneRegex = /^[6-9]\d{9}$/ 
        if(!phoneRegex.test(phone)){      
            return res.status(400).json({ status : 0, message : "Invalid phone formate" })
        }

        // == Check Role ==
        const roleData = await roleModel.findById(roleId)
        console.log("🚀 ~ signupUser ~ roleData:", roleData)
        if(!roleData){
            return res.status(400).json({ status : 0, message : "Invalid role Selected" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ==== Role wise validation ======
        if(roleData.name === 'student'){
            if(!interestOfField){
                return res.status(400).json({ status : 0, message : `Interest of field is required for student` })
            }
        }

        if(roleData.name === 'tutor'){
            // console.log("🚀 ~ signupUser ~ bio:", bio)
            // console.log("🚀 ~ signupUser ~ experience:", experience)
            // console.log("🚀 ~ signupUser ~ qualification:", qualification)
            // console.log("🚀 ~ signupUser ~ req.file:", req.file)
            if(!bio || !experience || !qualification || !req.file){
                return res.status(400).json({ status : 0,  message : "All tutor fields is required" })
            }
        }

        // === crreate user ===
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            roleId,

            interestOfField : roleData.name === 'student' ?  interestOfField : undefined,

            bio : roleData.name === 'tutor' ? bio : undefined,
            experience : roleData.name === 'tutor' ? experience : undefined,
            qualification : roleData.name === 'tutor' ? qualification : undefined,

            degreeCertificate : req.file ? req.file.path : undefined,

            approvalStatus : roleData.name === 'tutor' ? 'pending' : undefined
        })

        res.status(201).json({ status: 1, message: "User registered successfully", data: user });

    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while singup user" })
    }
}

// login
const loginUser = async (req, res) => {
    try{
        let { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ status : 0, message : "email and password required"})
        }

        const user = await userModel.findOne({ email }).populate('roleId')
        console.log("user : ", user)

        if(!user) {
            return res.status(404).json({ status : 0, message: "User not found, email invalid" });
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword) {
            return res.status(400).json({ status : 0, message: "Invalid Password" });
        }

        // don't show the password after login data 
        user.password = undefined

        // tutor approval check
        console.log("🚀 ~ loginUser ~ user.roleId.name:", user.roleId.name)
        if(user.roleId.name === "tutor"){
            if(user.approvalStatus === 'pending'){
                return res.status(403).json({ status : 0, message: "Wait for admin approval"});
            }

            if(user.approvalStatus === 'rejected'){
                return res.status(400).json({ status : 0, meesage : "your account was rejected by admin", reason : user.rejectionReason })
            }
        }

        const tokenObj = {
            id: user._id,
            name: user.name,
            role : user.roleId
        }
        console.log("🚀 ~ loginUser ~ tokenObj:", tokenObj)

        

        const token = jwt.sign( tokenObj, process.env.SECRET, { expiresIn: "1h" });

        res.status(201).json({ status : 1, message: "Login successful", token, data : user });

    } catch(err){
        console.log(err);
        res.status(500).send({ status : 0, message : "error while login user" })
    }
};

module.exports = { signupUser, loginUser }