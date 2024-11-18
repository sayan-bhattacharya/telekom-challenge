// routes/generateQuestion.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

// Grok API configuration
const GROK_API_URL = process.env.GROQ_API_URL;  // Make sure to add this to your .env file
const GROK_API_KEY = process.env.GROQ_API_KEY;  // Add the API Key to .env

// Endpoint to generate the question
router.post('/generate-question', async (req, res) => {
    const { cvText, jobDescription } = req.body;

    try {
        const prompt = `
            Generate a specific interview question for the candidate based on the following job description and CV text. 
            The question should be tailored to assess the candidate's relevant skills and personality traits.

            Job Description: ${jobDescription}
            CV Text: ${cvText}

            Also, analyze the candidate's Big Five personality traits based on this information.
        `;

        const response = await axios.post(GROK_API_URL, {
            prompt,
            max_tokens: 150,
        }, {
            headers: {
                Authorization: `Bearer ${GROK_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const question = response.data.choices[0].text;
        res.json({ question });
    } catch (error) {
        console.error('Error generating question:', error);
        res.status(500).json({ message: 'Failed to generate question' });
    }
});

export default router;