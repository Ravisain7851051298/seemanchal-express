const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter (images, documents, and videos)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|pdf|mp4|webm|mov|mkv|avi|ogg|3gp|m4v/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimeAllowed = file.mimetype.startsWith('image/') ||
                      file.mimetype.startsWith('video/') ||
                      file.mimetype === 'application/pdf';

  if (allowed.test(ext) || mimeAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and video files (mp4, webm, mov, mkv) are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB limit to support news videos
  fileFilter,
});

// Dedicated video filter
const videoFilter = (req, file, cb) => {
  const allowed = /mp4|webm|mov|mkv|avi|ogg|3gp|m4v/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowed.test(ext) || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files (MP4, WebM, MOV, MKV) are allowed'));
  }
};

const uploadVideo = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit for news videos
  fileFilter: videoFilter,
});

// @route   POST /api/upload
// @desc    Upload single file (images, docs, videos)
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl,
      fileName: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/upload/video
// @desc    Upload news video file
router.post('/video', uploadVideo.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file provided' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Video uploaded successfully',
      fileUrl,
      fileName: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
