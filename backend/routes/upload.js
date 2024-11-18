import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads', 'videos');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

const upload = multer({ storage });

// Define video upload route
router.post('/upload-video', upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }
        const videoURL = `/uploads/videos/${req.file.filename}`;
        res.status(200).json({ message: 'Video uploaded successfully', videoURL });
    } catch (error) {
        console.error("Error during video upload:", error);
        res.status(500).json({ message: 'Server error during video upload', error: error.message });
    }
});

export default router;