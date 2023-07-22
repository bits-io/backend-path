const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/')
    },
    filename: (req, file, cb)=>{
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext)
    }
});

let upload = multer ({
    storage: storage,
    fileFilter: (req, file, callback)=>{
        if ( file.mimetype == 'image/png' || file.mimetype == 'image/jpg' ) {
            callback(null, true)
        } else {
            const error = {
                message: 'Only jpg & png file supported!'
            }
            throw error
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
});

module.exports = upload