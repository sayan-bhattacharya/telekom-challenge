// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
return (
<div className="max-w-5xl mx-auto text-center pt-12">
    <div className="mb-12">
    <h1 className="text-5xl font-bold mb-6">
        <span className="text-telekom-magenta">Deutsche Telekom IT</span>
        <br />
        <span className="text-telekom-gray-800">Student Platform</span>
    </h1>
    <p className="text-xl text-telekom-gray-600 max-w-2xl mx-auto">
        Connect with research opportunities and working student positions 
        at one of Europe's leading telecommunications companies.
    </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
    <Link to="/topics" className="card group">
        <div className="h-40 gradient-bg rounded-lg mb-6 flex items-center justify-center">
        <span className="text-white text-4xl font-bold">Research</span>
        </div>
        <h2 className="text-2xl font-bold mb-4 group-hover:text-telekom-magenta transition-colors">
        Research Topics
        </h2>
        <p className="text-telekom-gray-600">
        Explore cutting-edge research opportunities and connect with expert mentors
        </p>
    </Link>
    
    <Link to="/jobs" className="card group">
        <div className="h-40 gradient-bg rounded-lg mb-6 flex items-center justify-center">
        <span className="text-white text-4xl font-bold">Work</span>
        </div>
        <h2 className="text-2xl font-bold mb-4 group-hover:text-telekom-magenta transition-colors">
        Working Student Positions
        </h2>
        <p className="text-telekom-gray-600">
        Find exciting working student opportunities and start your career journey
        </p>
    </Link>
    </div>
</div>
);
}

export default Home;