// const createCourse = require("../model/courseModel")
// const userModel = require("../model/userModel")

// const addCourse = async(req, res) => {
//     try{
//         const { tutorId, title, descriptopm, price, category } = req.body
//         // video in file

//         if(!tutorId || !title || !descriptopm || req.file || !price || !category){
//             return res.status(400).json({ status : 0, message : "all filled are required" })
//         }

//         // ==== check exist tutor ====
//         const checkTutor = await userModel.findById(tutorId)
//         if(!checkTutor){
//             return res.status(404).json({ status : 0, message : "tutor not found" })
//         }

//         // ==== Validation ====
//         if()


//     } catch(err){   
//         console.log(err);
//         res.status(500).json({ status : 0, message : "error while add course by tutor" })
//     }
// }
