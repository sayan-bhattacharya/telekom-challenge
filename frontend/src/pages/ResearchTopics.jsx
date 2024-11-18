// src/pages/ResearchTopics.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResearchTopics() {
const [topics, setTopics] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchTopics = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/topics'); // Updated URL
            setTopics(response.data);
        } catch (error) {
            console.error("Error fetching topics:", error.message);
            setError("Failed to load topics.");
        } finally {
            setLoading(false);
        }
    };
    fetchTopics();
}, []);

if (loading) return <div>Loading topics...</div>;
if (error) return <div className="text-red-500">{error}</div>;

return (
    <div className="topics-container">
        <h1 className="page-title">Research Topics</h1>
        {topics.length > 0 ? (
            <ul>
                {topics.map((topic) => (
                    <li key={topic._id}>
                        <h2>{topic.title}</h2>
                        <p>{topic.description}</p>
                    </li>
                ))}
            </ul>
        ) : (
            <div>No topics available at the moment.</div>
        )}
    </div>
);
}

export default ResearchTopics;