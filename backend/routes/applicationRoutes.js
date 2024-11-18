// applicationRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadApplication, uploadCV, getGeneratedQuestion, checkProcessingStatus, getAllApplications } from '../controllers/applicationController.js';

const router = express.Router();

// Configure multer storage for different upload destinations based on fieldname
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = file.fieldname === 'cv' ? 'uploads/cvs' : 'uploads/videos';
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Route for submitting an application with CV and video
router.post('/applications', upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'video', maxCount: 1 }]), uploadApplication);

// Route for uploading a CV file to generate an interview question
router.post('/applications/uploadCV', upload.single('cv'), uploadCV);

// Route for retrieving a generated question by requestId
router.get('/applications/question/:requestId', getGeneratedQuestion);

// Route to check the status of question processing by requestId
router.get('/applications/status/:requestId', checkProcessingStatus);

// Route to retrieve all applications (for recruiters/admin)
router.get('/applications', getAllApplications);

export default router;