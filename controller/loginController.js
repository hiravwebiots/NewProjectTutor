const userModel = require('../model/userModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// multer call or not here?

// Signup Student & tutor
const signupUser = async(req, res) => {
    try{
        const { name, email, password, phone, role, interestOfField, bio, experience, qualification } = req.body
        // degreeCertificate in file

        if(!name || !email || !password || !phone || !role){
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

        // Allow only student or tutor
        const allowedRoles = ["student", "tutor"];
        if(role && !allowedRoles.includes(role)) {
            return res.status(400).json({ status: 0, message: "Invalid role selected"});
        }
    
        // ==== Role wise validation ======
        if(role === 'student' && !interestOfField){
            return res.status(400).json({ status : 0, message : "Interest Of Filled is required" })
        }
        
        if(role === 'tutor' && (!bio || !experience || !qualification || !req.file)){
            return res.status(400).json({ status : 0,  message : "All tutor filled is required" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            interestOfField : role === 'student' ?  interestOfField : undefined,
            bio : role === 'tutor' ? bio : undefined,
            experience : role === 'tutor' ? experience : undefined,
            qualification : role === 'tutor' ? qualification : undefined,
            degreeCertificate : role === 'tutor' ? req.file.path : undefined,
            approvalStatus : role === 'tutor' ? 'pending' : undefined
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

        const user = await userModel.findOne({ email });
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
        if(user.role === "tutor"){
            if(user.approvalStatus === 'pending'){
                return res.status(403).json({ status : 0, message: "Wait for admin approval"});
            }

            if(user.approvalStatus === 'rejected'){
                return res.status(400).json({ status : 0, meesage : "your account was rejected by admin", reason : user.rejectionReason })
            }
        }

        const tokenObj = {
            id: user._id, 
            role: user.role
        }
        const token = jwt.sign( tokenObj, process.env.SECRET, { expiresIn: "1h" });

        res.status(201).json({ status : 1, message: "Login successful", token, data : user });

    } catch(err){
        console.log(err);
        res.status(500).send({ status : 0, message : "error while login user" })
    }
};

module.exports = { signupUser, loginUser }