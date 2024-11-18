// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
    // State for applications, loading, and error messages
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch applications from backend when the component loads
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/applications', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setApplications(response.data);
            } catch (error) {
                setError("Failed to fetch applications.");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    // Display loading or error messages if necessary
    if (loading) return <div>Loading applications...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="dashboard-container">
            <h1>Recruiter Dashboard</h1>
            
            {applications.length > 0 ? (
                <ul className="applications-list">
                    {applications.map((app) => (
                        <li key={app._id} className="application-card">
                            <h2>{app.studentName}</h2>
                            <p>Email: {app.email}</p>
                            <p>Message: {app.message || "No message provided."}</p>

                            {/* CV Download Link */}
                            {app.cvURL && (
                                <a href={app.cvURL} target="_blank" rel="noopener noreferrer">
                                    Download CV
                                </a>
                            )}

                            {/* Video URL Link (YouTube or uploaded video) */}
                            {app.videoURL ? (
                                <a href={app.videoURL} target="_blank" rel="noopener noreferrer">
                                    Watch Video
                                </a>
                            ) : (
                                <p>No video available</p>
                            )}

                            {/* Display generated summary from Groq API */}
                            {app.summary && (
                                <div className="summary">
                                    <h3>Candidate Summary</h3>
                                    <p>{app.summary}</p>
                                </div>
                            )}

                            {/* Display transcription of the video */}
                            {app.transcription && (
                                <div className="transcription">
                                    <h3>Video Transcription</h3>
                                    <p>{app.transcription}</p>
                                </div>
                            )}

                            <p>Submitted on: {new Date(app.dateSubmitted).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <div>No applications available.</div>
            )}
        </div>
    );
}

export default Dashboard;