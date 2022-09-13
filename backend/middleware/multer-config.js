<<<<<<< HEAD
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
=======
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');
>>>>>>> 128f4de75d3d137bdf6521d5906e7eb1a9a05a39
