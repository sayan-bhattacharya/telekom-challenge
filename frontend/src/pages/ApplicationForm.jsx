// src/pages/ApplicationForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

// Styled components for improved aesthetics
const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-family: Arial, sans-serif;
`;

const Title = styled.h2`
    color: #333;
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 10px;
    color: #555;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const FileInput = styled.input`
    margin-top: 10px;
`;

const Button = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    &:hover {
        background-color: #555;
        color: #fff;
    }
`;

function ApplicationForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const jobId = new URLSearchParams(location.search).get('jobId');

    // State for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cvFile, setCvFile] = useState(null);

    // Auto-fill name and email if available in local storage
    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedEmail = localStorage.getItem('email');
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!jobId) {
            alert("Job ID is missing.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("cv", cvFile);
        formData.append("jobId", jobId);

        try {
            const response = await axios.post('http://localhost:5001/api/applications/upload-cv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            navigate(`/video-recorder?jobId=${jobId}&requestId=${response.data.requestId}`);
        } catch (error) {
            console.error("Error uploading CV:", error);
            alert("Failed to submit application.");
        }
    };

    return (
        <FormContainer>
            <Title>Job Application Form</Title>
            <form onSubmit={handleSubmit}>
                <Label>Name:</Label>
                <Input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    placeholder="Enter your full name" 
                />
                <Label>Email:</Label>
                <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="Enter your email address" 
                />
                <Label>Upload CV:</Label>
                <FileInput 
                    type="file" 
                    onChange={(e) => setCvFile(e.target.files[0])} 
                    required 
                />
                <Button type="submit">Submit Application</Button>
            </form>
        </FormContainer>
    );
}

export default ApplicationForm;