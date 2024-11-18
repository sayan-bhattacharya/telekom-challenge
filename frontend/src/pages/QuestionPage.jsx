// src/pages/QuestionPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    font-family: Arial, sans-serif;
    color: #333;
`;

const Title = styled.h2`
    font-size: 1.8em;
    color: #333;
    margin-bottom: 15px;
`;

const Message = styled.p`
    font-size: 1.2em;
    color: #555;
    text-align: center;
    max-width: 600px;
    margin: 20px 0;
`;

function QuestionPage({ cvText, jobDescription }) {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('applicationId');

    useEffect(() => {
        if (!applicationId) {
            console.error("Application ID is missing in URL.");
            setError("Application ID is missing. Please check the URL and try again.");
            setLoading(false);
            return;
        }

        const fetchQuestion = async () => {
            const prompt = `
                Given the following CV and job description, generate a thoughtful interview question.

                CV:
                ${cvText}

                Job Description:
                ${jobDescription}
            `;

            try {
                const response = await axios.post('https://api.groq.com/llama', {
                    prompt,
                    model: 'llama',
                    max_tokens: 100,
                });
                setQuestion(response.data.question || "No question generated");
            } catch (error) {
                console.error("Error generating question:", error.message);
                setError("Failed to generate question. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [cvText, jobDescription, applicationId]);

    return (
        <PageContainer>
            <Title>Generated Interview Question</Title>
            {loading && <Message>Loading question...</Message>}
            {error && <Message style={{ color: 'red' }}>{error}</Message>}
            {question && !loading && !error && <Message>{question}</Message>}
        </PageContainer>
    );
}

export default QuestionPage;