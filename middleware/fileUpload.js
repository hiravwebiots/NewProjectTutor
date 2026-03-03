const multer = require('multer')
const path = require('path')


// ==== tutor degree certificate ====
const degreeStorage = multer.diskStorage({
    destination : (req, file, cb) => {         
        cb(null, 'uploads/degrees') 
    },
    filename : (req, file, cb) => {             
        cb(null, Date.now() + path.extname(file.originalname))   
    }
})

const degreeFilter = (req, file, cb) => {
    const allowTypes = ['image/jpg', 'image/jpeg', 'image/png, application/pdf']

    if(allowTypes.includes(file.mimetype)){  
        cb(null, true)  
    }else{
        cb(new Error('only jpg, jpeg, png & pdf allowed'), false)
    }
}

const uploadDegree = multer({
    storage : degreeStorage,
    fileFilter : degreeFilter,
    limits : { fileSize : 5 * 1024 * 1024 } // 5MB
})



// === Video and material pdf upload ===
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        if(file.fieldname === 'video'){
            cb(null, 'uploads/cours-videos')
        }
        if(file.fieldname === 'material'){
            cb(null, 'uploads/course-materials')
        }
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if(file.fieldname === 'video'){
        const allowTypes = ['video/mp4', 'video/mkv']
        if(allowTypes.includes(file.mimetype)){
            cb(null, true)
        } else{
            cb(new Error('Only mp4 & mkv allowed'), false)
        }
    }

    else if(file.fieldname === 'material'){
        if(file.mimetype === 'application/pdf'){
            cb(null, true)
        } else{
            cb(new Error('only PDF allowed'), false)
        }
    }

    else{
        cb(new Error('Unexpected error in fileFilter'))
    }
}

const uploadCourseFiles = multer({
    storage,
    fileFilter,
    limits : { fileSize : 5 * 1024 * 1024 * 1024 } //5GB
})

module.exports = { uploadDegree, uploadCourseFiles }