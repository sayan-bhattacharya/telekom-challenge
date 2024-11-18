import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Sample student CV text and job description for testing
const sampleCvText = `
John Doe is an experienced software engineer with a strong background in full-stack development.
Proficient in JavaScript, React, Node.js, and has worked on multiple large-scale projects.
Holds a Bachelor's degree in Computer Science and has over 5 years of industry experience.
`;

const sampleJobDescription = `
We are looking for a software engineer with expertise in full-stack development.
The ideal candidate should have proficiency in JavaScript, React, and Node.js.
Responsibilities include developing and maintaining web applications and collaborating with cross-functional teams.
A Bachelor's degree in Computer Science and 3+ years of experience are preferred.
`;

// Function to generate question based on CV and Job Description
async function generateQuestion() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant that formulates interview questions based on candidate CV and job descriptions."
        },
        {
          "role": "user",
          "content": `Using the following CV text and job description, generate a relevant interview question.

        CV Text: ${sampleCvText}

        Job Description: ${sampleJobDescription}

        Create a question that would help assess the candidate's fit for the role.`
        }
      ],
      "model": "llama3-8b-8192",
      "temperature": 0.7,
      "max_tokens": 100,
      "top_p": 1,
      "stream": false
    });

    console.log("Generated Question:", chatCompletion.choices[0]?.message?.content || '');
  } catch (error) {
    console.error("Error fetching question from Groq LLAMA model:", error.message);
  }
}

// Run the function
generateQuestion();