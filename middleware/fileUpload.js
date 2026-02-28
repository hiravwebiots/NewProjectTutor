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


// ==== course video storage ====
const videoStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'uploads/cours-videos')
    },
    filename : (req, file, cb) => { 
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const videoFilter = (req, file, cb) => {
    const allowTypes = [ 'video/mp4', 'video/mkv' ]

    if(allowTypes.includes(file.mimetype)){
        cb(null, true)
    } else{
        cb(new Error('only mp4 & mkv'), false)
    }
}

const uploadVideo = multer({
    storage : videoStorage,
    fileFilter : videoFilter,
    limits : { fileSize : 1 * 1024 * 1024 * 1024 } // 1GB
})


module.exports = { uploadDegree, uploadVideo }