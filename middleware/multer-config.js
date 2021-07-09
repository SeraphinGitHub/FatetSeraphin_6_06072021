
const multer = require("multer");

const MIMES_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png"
}

const storage = multer.diskStorage({

    destination: (req, file, callback) =>{
        callback(null, "pictures")
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        // const extension = MIMES_TYPES[file.mimetype];
        // callback(null, name + Date.now() + "." + extension);
        callback(null, Date.now() + "." + name);
    }
});

module.exports = multer({ storage }).single("image");