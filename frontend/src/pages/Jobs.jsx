// src/pages/Jobs.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/TopicsJobs.css';

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/jobs');
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error.message);
                setError("Failed to load jobs.");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = (jobId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please log in to apply for a job.");
            navigate('/login');
            return;
        }
        
        // Navigate to Application Form with jobId
        navigate(`/application-form?jobId=${jobId}`);
    };

    if (loading) return <div className="text-center">Loading jobs...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="jobs-container">
            <h1 className="page-title">Working Student Jobs</h1>
            <div className="jobs-grid">
                {jobs.map((job) => (
                    <div key={job._id} className="job-card">
                        <h2 className="job-title">{job.title}</h2>
                        <p className="job-description">{job.description}</p>
                        <p className="job-location"><strong>Location:</strong> {job.location}</p>
                        <p className="job-department"><strong>Department:</strong> {job.department}</p>
                        <button 
                            className="btn-primary"
                            onClick={() => handleApply(job._id)}
                        >
                            Apply Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Jobs;