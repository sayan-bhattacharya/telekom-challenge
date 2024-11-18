import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Background from '../components/Background';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', formData.role);

            alert('Login Successful!');
            navigate(formData.role === 'student' ? '/jobs' : '/dashboard');
        } catch (error) {
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <Background />
            <div className="relative z-10 max-w-md w-full bg-white p-10 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">DT Student Platform</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                        <option value="student">Student</option>
                        <option value="recruiter">Recruiter</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-4">
                    <a href="/signup" className="text-pink-500 hover:underline">Don’t have an account? Sign Up</a>
                </div>
            </div>
        </div>
    );
}

export default Login;