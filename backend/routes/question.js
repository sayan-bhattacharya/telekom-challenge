// backend/routes/question.js

import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

dotenv.config();

const router = express.Router();

// Endpoint to generate a question based on CV and job description
router.get('/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;

        // Fetch the application details using requestId instead of _id
        const application = await Application.findOne({ requestId });
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Fetch the job details
        const job = await Job.findOne({ title: application.jobTitle });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const cvText = application.cvText;
        const jobDescription = job.description;

        // Prepare the prompt for the language model
        const prompt = `
        Create a thoughtful interview question based on the candidate's CV and the job description.

        Job Description: ${jobDescription}

        CV Text: ${cvText}

        Question:
        `;

        // Make request to Groq or LLaMA API (replace this with your actual model API call)
        const response = await axios.post(process.env.GROQ_API_URL, {
            prompt: prompt,
            max_tokens: 50
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_SECRET}`,
                'Content-Type': 'application/json'
            }
        });

        const question = response.data.choices[0].text.trim();

        res.status(200).json({ question });
    } catch (error) {
        console.error("Error generating question:", error);
        res.status(500).json({ message: "Error generating question", error: error.message });
    }
});

export default router;