// routes/jobs.js
import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

// Route to get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find(); // Fetch all jobs from the Job collection
        res.json(jobs);  // Send job data as a JSON response
    } catch (error) {
        console.error("Error fetching jobs:", error.message);
        res.status(500).json({ message: "Failed to retrieve jobs." });
    }
});

export default router;