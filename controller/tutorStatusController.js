const emailTemplateModel = require('../model/emailTemplateModel');
const roleModel = require('../model/roleModel');
const userModel = require('../model/userModel');
const sendEmail = require('../utils/sendEmail');

const checkTutorStatus = async (req, res) => {
    try{

        const tutorRole = await roleModel.findOne({ name : "tutor"})

        const tutors = await userModel.find({ role : tutorRole.id,  approvalStatus : 'pending'}).select('-password').populate('role')
        
        // tutro if not pending & find return blank array[] so need length === 0 
        if (tutors.length === 0) {
            return res.status(200).json({ status: 0, message: 'No pending tutors found'});
        }

        res.status(200).json({ status : 1, message : "get pending tutors", data : tutors })
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while check tutro status" })
    }
}

const updateTutorStatus = async (req, res) => {
    try{
        const tutorId = req.params.id
        const { approvalStatus, rejectionReason } = req.body    // approved or rejected

        if(!['approved', 'reject'].includes(approvalStatus)){
            return res.status(400).json({ status : 0, message : "Invalid approval status" })
        }

        // ==== Find tutor ====
        const tutor = await userModel.findById(tutorId).populate('role')
        if(!tutor || tutor.role.name !== 'tutor'){
            return res.status(404).json({ status : 0, message : 'tutor not found' })
        }

        // ====  Allow only pending or rejected to be updated ====
        if(tutor && !['pending', 'rejected'].includes(tutor.approvalStatus)){
            return res.status(400).json({ status : 0, message : "pennding & rejection tutor aren't available" })
        }

        if(approvalStatus === 'rejected' && !rejectionReason){
            return res.status(400).json({ status : 0, message : "rejection reason is required" })
        }

        const updateStatus = {
            approvalStatus,
            rejectionReason : approvalStatus === 'rejected' ? rejectionReason : undefined
        }

        const updateTutor = await userModel.findByIdAndUpdate(
            tutorId,
            updateStatus,
            { new : true }
        )

        // ==== Find Email Template for Send approved email ====
        if(approvalStatus === 'approved'){
            const template = await emailTemplateModel.findOne({ title : "Tutor Approved" })
            if(!template){
                return res.status(500).json({ status : 0, message : "Template not found" })
            }

            await sendEmail(
                tutor.email,
                template.subject,
                template.content,
                {
                    name : tutor.name
                }
            )
        }
        
        // ==== find email template for reject ====
        if(approvalStatus === 'rejected'){
            const template = await emailTemplateModel.findOne({ title : "Tutor Rejected" })
            if(!template){
                return res.status(500).json({ status : 0, message : "Template not found" })
            }

            await sendEmail(
                tutor.email,
                template.subject,
                template.content,
                {
                    name : tutor.name,
                    reason : rejectionReason
                }
            )
        }
        res.status(201).json({ status : 1, message : "tutor update status sucessfully", data : updateTutor })

    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while update tutor status" })
    }
}

module.exports = {checkTutorStatus, updateTutorStatus}