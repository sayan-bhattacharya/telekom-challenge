// controllers/questionController.js
import axios from 'axios';
import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const generateQuestion = async (req, res) => {
    try {
        const { jobDescription, cvFileName } = req.body;
        console.log("Received job description and CV filename:", jobDescription, cvFileName);

        // Define path to CV file
        const cvPath = path.join(__dirname, '..', 'uploads', 'cvs', cvFileName);
        if (!fs.existsSync(cvPath)) {
            console.error("CV file not found at:", cvPath);
            return res.status(404).json({ message: "CV file not found." });
        }

        // Read and parse CV
        const cvBuffer = fs.readFileSync(cvPath);
        const cvData = await pdf(cvBuffer);
        const cvText = cvData.text;
        console.log("Parsed CV text:", cvText);

        // Ensure Groq API configurations are loaded
        const groqApiUrl = process.env.GROQ_API_URL;
        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiUrl || !groqApiKey) {
            console.error("Groq API URL or API Key is missing");
            return res.status(500).json({ message: "Groq API configuration missing." });
        }

        // Make API call to Groq (or use mock response for testing)
        const questionResponse = await axios.post(groqApiUrl, {
            model: "llama3-8b-8192",
            messages: [
                {
                    role: "user",
                    content: `Based on the following CV: ${cvText} and job description: ${jobDescription}, generate a question.`,
                },
            ],
        }, {
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const question = questionResponse.data.choices[0].message.content;
        console.log("Generated question:", question);
        res.status(200).json({ question });
    } catch (error) {
        console.error("Error generating question:", error.message);

        if (error.response) {
            console.error("External API response error:", error.response.data);
        }

        res.status(500).json({ message: "Failed to generate question", error: error.message });
    }
};