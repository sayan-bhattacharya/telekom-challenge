// src/pages/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

function Signup() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/auth/register', formData);
            alert('Signup successful! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error.response ? error.response.data : error.message);
            alert(`Signup failed: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Sign Up</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="auth-input"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="auth-input"
                        onChange={handleChange}
                        required
                        autoComplete="email"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="auth-input"
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                    />
                    <select
                        name="role"
                        className="auth-input"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="student">Student</option>
                        <option value="recruiter">Recruiter</option>
                    </select>
                    <button type="submit" className="auth-button">Sign Up</button>
                </form>
                <Link to="/login" className="auth-link">Already have an account? Log in</Link>
            </div>
        </div>
    );
}

export default Signup;