const courseModel = require('../model/courseModel')
const userModel = require('../model/userModel')
const fs = require('fs')
const path = require('path')

const addCourse = async(req, res) => {
    try{
        const { title, description, price, category } = req.body
        const tutorId = req.user.id    // from check middleware

        console.log("tutorId : ", tutorId);

        if(!title || !description || !req.file || !price || !category){
            return res.status(400).json({ status : 0, message : "all fileds are required" })
        }

        // ==== check exist tutor ====
        const checkTutor = await userModel.findById(tutorId)
        if(!checkTutor || checkTutor.role !== 'tutor'){
            return res.status(404).json({ status : 0, message : "tutor not found"})
        }

        const createCourse = new courseModel({
            tutorId,
            title,
            description,
            video : req.file.path,
            material : req.file.path,
            price,
            category
        })
        const course = await createCourse.save()

        res.status(201).json({ status : 1, message : "course added sucessfully", data : course})
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while add course by tutor " })
    }
}

const getCourse = async(req, res) => {
    try{

        // ==== check who get the course by token ==
        const checkRole = req.user.role     // middleware 
        console.log("checkRole in get course : ", checkRole);
        
        // == if role is student then can't access video without purchase ==
        /** purchase logic remaining  */    
        if(checkRole === 'student'){
            const course = await courseModel.find().select('-video')
            return res.status(200).json({ status : 1, message : "List of Course", data : course})
        }

        const course = await courseModel.find()
        res.status(200).json({ status : 1, message : "Get list of course", data : course })
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while get course list" })
    }
}

// tutor self cours
const getSelfCourse = async(req, res) => {
    try{
        const userId = req.user.id // token user

        const courses = await courseModel.find({ tutorId : userId })
        res.status(200).json({ status : 1, message : "Get Your courses", data : courses })


    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "erro while get self course" })
    }
}

const updateCourse = async(req, res) => {
    try{
        const courseId = req.params.id
        const tutorId = req.user.id

        // ==== check tutor exist ====
        const checkTutor = await userModel.findById(tutorId)
        // console.log(checkTutor);

        if(!checkTutor && checkTutor.role !== 'tutor'){         // check id and also check it's tutor or not
            return res.status(403).json({ status : 0, message : "only tutor can update course" })
        }

        // ==== check course exist ==== 
        const existCourse = await courseModel.findById(courseId)
        if(!existCourse){
            return res.status(404).json({ status : 0, message : "course not exist" })
        }

        // ==== check course belongs to the this user ===
        if(existCourse.tutorId.toString() !== tutorId.toString()){
            return res.status(403).json({ status : 0, message : "You can update only your course" })
        }
    
        // ==== data update
        // const updateCourse = {      // In this compulsory update all fileds check
        //     title : req.body.title || title,
        //     description : req.body.description || description,
        //     video : req.file.path || video,         
        //     price : req.body.price || price,
        //     category : req.body.category || category
        // }   

        const updateData = {}
        if (req.body.title) updateData.title = req.body.title
        if (req.body.description) updateData.description = req.body.description
        if (req.body.price) updateData.price = req.body.price
        if (req.body.category) updateData.category = req.body.category
        if (req.file) updateData.video = req.file.path

        if(existCourse.video){
            const filePath = path.join('uploads/cours-videos', existCourse.video)
            if(fs.existsSync(filePath)){
                fs.unlink(filePath)
            }
        }

        const course = await courseModel.findByIdAndUpdate(
            courseId,
            updateData,
            { new : true }
        )
        res.status(200).json({ status : 1, message : "course updated", data : course })

    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while update course" })
    }
}

const deleteCourse = async(req, res) => {
    try{
        const courseId = req.params.id
        const tutorId = req.user._id    

        // === check tutot ==
        const checkTutor = await userModel.findById(tutorId)
        if(!checkTutor || checkTutor.role !== 'tutor'){
            return res.status(403).json({ status : 0, message : "only tutor can delete course" })
        }

        // ==== course exist or not ====
        const existCourse = await courseModel.findById(courseId)
        if(!existCourse){
            return res.status(404).json({ status : 0, message : "course not found" })
        }

        // ==== check course belongs to the this user ===
        if(existCourse.tutorId.toString() !== tutorId.toString()){
            return res.status(403).json({ status : 0, message : "you can delete only your course"})
        }   

        if(existCourse.video){
            const filePath = path.join('uploads/cours-videos', existCourse.video)
            if(fs.existsSync(filePath)){
                fs.unlink(filePath)
            }
        }

        const course = await courseModel.findByIdAndDelete(courseId)

        res.status(200).json({ status : 1, message : "course deleted Successfully" })

    } catch(err){   
        console.log(err);
        res.status(500).json({ status : 0, message : "error while delete course" })
    }
}

module.exports = { addCourse, getCourse, getSelfCourse, updateCourse, deleteCourse }