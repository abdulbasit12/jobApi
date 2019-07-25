const multer = require('multer');
const path = require('path');
const storage = '';
function checkFileType(file, callback){
    const fileType = /jpeg|jpg|png|gif/;
    const extname = fileType.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileType.test(file.mimetype);
    if (mimetype && extname) {
        return callback(null, true)
    } else {
        callback('Error: Images Only!')
    }
}

module.exports = {


    //set storage engine
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    }),

    //Init Upload
    upload: multer({
        storage: storage,
        limits: { fileSize: 1000000 },
        fileFilter: (req, file, callback) => {
            checkFileType(file, callback)
        }
    }),


}