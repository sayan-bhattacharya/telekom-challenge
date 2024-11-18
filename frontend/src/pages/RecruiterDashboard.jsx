// src/pages/RecruiterDashboard.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const DashboardContainer = styled.div`
    padding: 20px;
`;

const ApplicationCard = styled.div`
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
`;

const Button = styled.button`
    padding: 5px 10px;
    margin-right: 10px;
    cursor: pointer;
`;

function RecruiterDashboard() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/applications/get-applications');
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, []);

    const downloadCV = (cvURL) => {
        window.open(cvURL, '_blank');
    };

    return (
        <DashboardContainer>
            <h2>Applications</h2>
            {applications.map((app) => (
                <ApplicationCard key={app._id}>
                    <p><strong>Name:</strong> {app.studentName}</p>
                    <p><strong>Email:</strong> {app.email}</p>
                    <Button onClick={() => downloadCV(app.cvURL)}>Download CV</Button>
                    {app.videoURL && (
                        <video controls src={app.videoURL} style={{ width: '100%', maxWidth: '500px' }} />
                    )}
                </ApplicationCard>
            ))}
        </DashboardContainer>
    );
}

export default RecruiterDashboard;