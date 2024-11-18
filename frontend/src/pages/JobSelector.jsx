// src/components/JobSelector.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function JobSelector() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/jobs');
                setJobs(response.data || []); // Set to empty array if response is undefined
            } catch (error) {
                console.error("Error fetching jobs:", error.message);
                setError("Failed to load jobs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <p>Loading jobs...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            <h1>Available Jobs</h1>
            {jobs.length > 0 ? (
                jobs.map((job) => (
                    <div key={job._id}>
                        <h3>{job.title}</h3>
                        <p>{job.description}</p>
                        <Link to={`/application-form?jobId=${job._id}`}>Apply Now</Link>
                    </div>
                ))
            ) : (
                <p>No jobs available at the moment.</p>
            )}
        </div>
    );
}

export default JobSelector;