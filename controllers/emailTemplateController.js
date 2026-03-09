const emailTemplateModel = require('../models/emailTemplateModel')

const createTemplate = async(req, res) => {
    try{
        const { title, subject, content } = req.body

        if(!title){
            return res.status(400).json({ status : 0, message : "title is required" })
        }
        
        if(!subject){
           return  res.status(400).json({ status : 0, message : "subject is required" })
        }

        if(!content){
            return res.status(400).json({ status : 0, message : "content is required" })
        }

        const template = await emailTemplateModel.create({
            title,
            subject,
            content
        })

        res.status(201).json({ status : 1, message : "Templte Created" , data : template})
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : err.message })
    }
}

const readTemplate = async(req, res)  => {
    try{
        const readTemp = await emailTemplateModel.find()
        if(readTemp.length === 0){
            return res.status(200).json({ status : 1, message : "no template available " })
        } 
        res.status(200).json({ status : 1, message : 'read All email template', data : readTemp})
    } catch(err){
        res.status(500).json({ status : 0, message : 'Error while get All template', error : err })
    }
}

const updateTemplate = async(req, res) => {
    try{
        const tempId = req.params.id
        const { title, subject, content } = req.body

        const checkTempId = await emailTemplateModel.findById(tempId)
        if(!checkTempId){
            return res.statis(404).json({ status : 0, message : "emailTemplate not found" })
        }

        const updateData = {
            title : req.body.title || tempId.title,
            subject : req.body.subject || tempId.subject,
            content : req.body.content || tempId.content
        }

        const updateTemp = await emailTemplateModel.findByIdAndUpdate(
            tempId,
            updateData,
            { new : true }
        )
        res.status(200).json({ status : 1, message : "update template successfully", data : updateTemp})
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while update emailTemplate" })
    }
}

const deleteTemplate = async(req, res) => {
    try{    
        const tempId = req.params.id

        const checkTempId = await emailTemplateModel.findById(tempId)
        if(!tempId){
            return res.status(404).json({ status : 0, message : "emailTemplate not found" })
        }

        const deleteTemp = await emailTemplateModel.findByIdAndDelete(tempId)
        res.status(200).json({ status : 1, message : "emailTemplate Deleted" })
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "erro while delete emailTemaplte" })
    }
}

module.exports = { createTemplate, readTemplate, updateTemplate, deleteTemplate}