// backend/routes/applications.js

import express from 'express';
import Application from '../models/Application.js';
import {
    uploadCV,
    checkProcessingStatus
} from '../controllers/applicationController.js';
import tokenVerification from '../middleware/tokenVerification.js';
import roleVerification from '../middleware/roleVerification.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import groqApi from '../services/groqApi.js';
import whisperApi from '../services/whisperApi.js';

const router = express.Router();

// Configure multer for CV uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads', 'cvs');
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

// Route to get all applications (accessible only to recruiters)
router.get('/', tokenVerification, roleVerification(['recruiter']), async (req, res) => {
    try {
        const applications = await Application.find();
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Failed to fetch applications." });
    }
});

// Route to fetch a single application by ID (accessible only to recruiters)
router.get('/:id', tokenVerification, roleVerification(['recruiter']), async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found." });
        }
        res.status(200).json({ success: true, data: application });
    } catch (error) {
        console.error("Error fetching application:", error);
        res.status(500).json({ success: false, message: "Failed to fetch application." });
    }
});

// Route to upload a CV (accessible only to students)
router.post('/upload-cv', tokenVerification, roleVerification(['student']), upload.single('cv'), uploadCV);

// Route to check the status of CV processing (accessible to all logged-in users)
router.get('/status/:requestId', tokenVerification, checkProcessingStatus);

// Route to delete an application by ID (accessible only to recruiters)
router.delete('/:id', tokenVerification, roleVerification(['recruiter']), async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found." });
        }
        res.status(200).json({ success: true, message: "Application deleted successfully." });
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({ success: false, message: "Failed to delete application." });
    }
});

// New Route: Submit an Application with CV and Video Link
router.post('/submit-application', tokenVerification, roleVerification(['student']), async (req, res) => {
    try {
        const { studentName, email, message, cvURL, videoURL } = req.body;

        // Generate summary from Groq API using the CV URL
        const summary = await groqApi.generateSummary(cvURL);

        // Transcribe video using Whisper API or alternative transcription API
        const transcription = await whisperApi.transcribe(videoURL);

        // Create and save new application
        const application = new Application({
            studentName,
            email,
            message,
            cvURL,
            videoURL,
            summary,
            transcription
        });
        await application.save();

        res.status(201).json({ success: true, application });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ success: false, message: 'Failed to submit application.' });
    }
});

export default router;