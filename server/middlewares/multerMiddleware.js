const multer = require("multer");
const path = require("path");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Define the directory where files will be stored
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Name the file with a timestamp to avoid name conflicts
  },
});

// Set up Multer with file filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
