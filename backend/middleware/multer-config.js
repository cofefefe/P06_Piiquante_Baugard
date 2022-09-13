
// Multer to manage http request with files

// Import Multer
const multer = require('multer')
// Set format data
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/png' : 'png',
    'image/jpeg': 'jpg'
}

// Managing arrival destination of img to 'images' directory
const storage = multer.diskStorage({
    destination : (req, file, callback) =>{
        callback(null, 'images')
    },
    filename : (req,file,callback)=>{
        // create unique name to the file
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})
// Export middleware
module.exports = multer({storage}).single('image')
