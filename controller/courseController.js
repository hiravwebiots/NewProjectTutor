const courseModel = require('../model/courseModel')
const userModel = require('../model/userModel')

const addCourse = async(req, res) => {
    try{
        const { tutorId, title, descriptopm, video, price, category } = req.body

        if(!tutorId || !title || !descriptopm || !video || !price || !category){
            return res.status(400).json({ status : 0, message : "all fileds are required" })
        }

        // ==== check exist tutor ====
        const checkTutor = await userModel.findOne(tutorId)
        if(!checkTutor){
            return res.status(404).json({ status : 0, message : "tutor not found"})
        }

        const createCourse = new courseModel(req.body)
        const course = await createCourse.save()

        res.status(201).json({ status : 1, message : "course added sucessfully", data : course})
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while add course by tutor " })
    }
}

const getCourse = async(req, res) => {
    try{
        const course = await courseModel.find()
        res.status(200).json({ status : 1, message : "Get list of course", data : course })
    } catch(err){
        console.log(err);
        res.status(500).json({ status : 0, message : "error while get course list" })
    }
}

const updateCourse = async(req, res) => {
    try{
        const courseId = req.params.id
        const { tutorId, title, descriptopm, video, price, category } = req.body

        const existCourse = await courseModel.findById(courseId)
        if(!existCourse){
            return res.status(404).json({ status : 0, message : "course not exist" })
        }
        
        if(!tutorId || !title || !descriptopm || !video || !price || !category){
            return res.status(400).json({ status : 0, message : "all fileds are required" })
        }

        const checkTutor = await userModel.findById(tutorId)
        if(!checkTutor){
            return res.status(404).json({ status : 0, message : "tutor not exist" })
        }

        const updateCourse = {
            title : req.body.title || title,
            descriptopm : req.body.descriptopm || descriptopm,
            // video : req. 
            price : req.body.price || price,
            category : req.body.category || category
        }   

        const course = await courseModel.findByIdAndUpdate(
            courseId,
            updateCourse,
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
        
        const existCourse = await courseModel.findById(courseId)
        if(!existCourse){
            return res.status(404).json({ status : 0, message : "course not found" })
        }

        const course = await courseModel.findByidAndDelete(courseId)

        res.status(200).json({ status : 1, message : "course deketed Successfully" })

    } catch(err){   
        console.log(err);
        res.status(500).json({ status : 0, message : "error while delete course" })
    }
}

module.exports = { addCourse, getCourse, updateCourse, deleteCourse }