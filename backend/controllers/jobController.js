// In backend/controllers/jobController.js
import Job from '../models/Job.js';

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({}, { title: 1 }); // Fetch job title and id only
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error.message);
        res.status(500).json({ message: "Error fetching jobs" });
    }
};