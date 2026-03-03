const multer = require('multer')
const path = require('path')
const fs = require('fs')

function dirExist(dirpath){
    if(!fs.existsSync(dirpath)){
        fs.mkdirSync(dirpath, )
    }
}
const uploadDir = "../uploads/"

// === upload folder exist or not ===
dirExist(uploadDir)




function createuploder(subfolder = ''){
    const storage = multer.diskStorage({
        destination : (req, file, cb) => {
            const uploadPath = path.join(uploadDir, subfolder)
            dirExist(uploadPath)
            cb(null, uploadPathpload)
        },
        filename : (req, file, cb) => {             
            cb(null, Date.now() + path.extname(file.originalname))   
        }
    })
}


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
