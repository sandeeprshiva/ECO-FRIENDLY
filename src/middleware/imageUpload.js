const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = 'uploads/items';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for item images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `item-${uniqueSuffix}${fileExtension}`);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

// Middleware for single image upload
const uploadSingle = upload.single('image');

// Middleware for multiple images upload
const uploadMultiple = upload.array('images', 10);

// Middleware wrapper with error handling
const handleImageUpload = (uploadType) => {
  return (req, res, next) => {
    uploadType(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: 'File too large',
            message: 'Each image must be less than 5MB'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            error: 'Too many files',
            message: 'Maximum 10 images allowed'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            error: 'Unexpected file field',
            message: 'Use "images" field for multiple files or "image" for single file'
          });
        }
        return res.status(400).json({
          error: 'File upload error',
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          error: 'File upload error',
          message: err.message
        });
      }
      next();
    });
  };
};

// Helper function to process uploaded images
const processUploadedImages = (req) => {
  const images = [];
  
  if (req.file) {
    // Single image upload
    images.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/items/${req.file.filename}`
    });
  } else if (req.files && req.files.length > 0) {
    // Multiple images upload
    req.files.forEach(file => {
      images.push({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        url: `/uploads/items/${file.filename}`
      });
    });
  }
  
  return images;
};

// Helper function to delete image files
const deleteImageFile = (filename) => {
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Helper function to delete multiple image files
const deleteImageFiles = (filenames) => {
  filenames.forEach(filename => {
    deleteImageFile(filename);
  });
};

module.exports = {
  uploadSingle: handleImageUpload(uploadSingle),
  uploadMultiple: handleImageUpload(uploadMultiple),
  processUploadedImages,
  deleteImageFile,
  deleteImageFiles
};
