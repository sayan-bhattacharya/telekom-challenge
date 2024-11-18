// src/pages/StudentSubmissionPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import VideoRecorder from './VideoRecorder';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const QuestionBox = styled.div`
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    max-width: 600px;
    text-align: center;
    background-color: #f1f1f1;
`;

function StudentSubmissionPage({ cvText, jobDescription }) {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.post('http://localhost:5001/api/generate-question', {
                    cvText,
                    jobDescription,
                });
                setQuestion(response.data.question);
            } catch (error) {
                console.error('Error fetching question:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [cvText, jobDescription]);

    return (
        <Container>
            <h2>Submit Your Video Response</h2>
            {loading ? (
                <p>Loading question...</p>
            ) : (
                <QuestionBox>
                    <p><strong>Question:</strong> {question}</p>
                </QuestionBox>
            )}
            <VideoRecorder />
        </Container>
    );
}

export default StudentSubmissionPage;