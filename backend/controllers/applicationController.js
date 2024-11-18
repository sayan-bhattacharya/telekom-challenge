// Import dependencies
import fs from 'fs';
import pdf from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import Job from '../models/Job.js';
import Application from '../models/Application.js'; // Ensure this is correctly imported
import Groq from "groq-sdk";

dotenv.config();

// In-memory storage for question generation status
const processingStatus = {};
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper function to validate PDF structure
async function validatePdf(filePath) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        await pdf(fileBuffer);
        return true;
    } catch (error) {
        console.error("Invalid PDF structure:", error.message);
        return false;
    }
}

// Controller for application submission with file upload
export const uploadApplication = async (req, res) => {
    try {
        const { studentName, email, message, disability } = req.body;
        const cvFile = req.files?.cv ? req.files.cv[0] : null;
        const videoFile = req.files?.video ? req.files.video[0] : null;

        console.log("Received CV File:", cvFile); // Debugging log for CV
        console.log("Received Video File:", videoFile); // Debugging log for Video

        const application = new Application({
            studentName,
            email,
            message,
            disability,
            cvURL: cvFile ? `/uploads/cvs/${cvFile.filename}` : null,
            videoURL: videoFile ? `/uploads/videos/${videoFile.filename}` : null,
            dateSubmitted: new Date(),
        });

        console.log("Application to save:", application); // Check the application data before saving

        await application.save();
        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error("Error saving application:", error);
        res.status(500).json({ message: "Failed to submit application" });
    }
};

// Controller to retrieve all applications
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find();
        console.log("Applications fetched:", applications); // Debugging log to check fetched applications
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
};

// Controller to handle CV upload and generate interview question
export const uploadCV = async (req, res) => {
    const { jobId } = req.body;
    const cvFile = req.file;
    const requestId = uuidv4();

    if (!jobId) {
        return res.status(400).json({ message: "Job ID is missing." });
    }
    if (!cvFile) {
        return res.status(400).json({ message: "CV file is missing." });
    }

    const isValidPdf = await validatePdf(cvFile.path);
    if (!isValidPdf) {
        return res.status(400).json({ message: "Invalid PDF structure." });
    }

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }
        const jobDescription = job.description;
        const cvBuffer = fs.readFileSync(cvFile.path);
        const cvData = await pdf(cvBuffer);
        const cvText = cvData.text;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Formulate an interview question based on candidate CV and job descriptions." },
                { role: "user", content: `CV: ${cvText}\nJob Description: ${jobDescription}\n` }
            ],
            model: "llama3-8b-8192",
            temperature: 0.7,
            max_tokens: 100,
            top_p: 1,
            stream: false
        });

        const question = chatCompletion.choices[0]?.message?.content || 'No question generated';
        console.log("Generated Question:", question);

        // Store the generated question under the requestId in processingStatus
        processingStatus[requestId] = { status: "completed", result: question };
        console.log("Storing question with requestId:", requestId);

        res.status(202).json({ requestId, status: "processing" });
    } catch (error) {
        console.error("Error during CV processing or question generation:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};
// Controller to check the status of question processing by requestId
export const checkProcessingStatus = (req, res) => {
    const { requestId } = req.params;
    const request = processingStatus[requestId];
    if (!request) {
        return res.status(404).json({ message: "Invalid request ID" });
    }

    res.json(request);
};

// Controller to fetch the generated question by requestId
// Controller to fetch the generated question by requestId
export const getGeneratedQuestion = (req, res) => {
    const { requestId } = req.params;
    console.log(`Fetching question for requestId: ${requestId}`);

    const questionData = processingStatus[requestId];
    if (!questionData) {
        console.error(`RequestId ${requestId} not found.`);
        return res.status(404).json({ message: "Question not found or still processing." });
    }

    console.log(`Retrieved question for requestId ${requestId}:`, questionData);
    res.json({ question: questionData.result });
};