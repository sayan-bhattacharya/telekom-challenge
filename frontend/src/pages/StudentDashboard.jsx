// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentDashboard() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/topics', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setTopics(response.data);
            } catch (error) {
                setError('Failed to load research topics.');
            } finally {
                setLoading(false);
            }
        };
        fetchTopics();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Available Research Topics</h1>
            <ul>
                {topics.map((topic) => (
                    <li key={topic._id} className="topic-item">
                        <h2>{topic.title}</h2>
                        <p>{topic.description}</p>
                        <p><strong>Department:</strong> {topic.department}</p>
                        <p><strong>Mentor:</strong> {topic.mentor.name} ({topic.mentor.position})</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StudentDashboard;