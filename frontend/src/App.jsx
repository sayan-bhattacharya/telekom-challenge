import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SuccessPage from './pages/SuccessPage';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ResearchTopics from './pages/ResearchTopics';
import Jobs from './pages/Jobs';
import Dashboard from './pages/Dashboard';
import ApplicationForm from './pages/ApplicationForm';
import VideoRecorder from './pages/VideoRecorder';
import './styles/index.css';

const PrivateRoute = ({ children, role }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        const tokenListener = () => setIsAuthenticated(!!localStorage.getItem('token'));
        window.addEventListener('storage', tokenListener);
        return () => window.removeEventListener('storage', tokenListener);
    }, []);

    return isAuthenticated && userRole === role ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <Routes>
                        {/* Redirect root to login */}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        
                        {/* Student Routes */}
                        <Route path="/home" element={
                            <PrivateRoute role="student">
                                <Home />
                            </PrivateRoute>
                        } />
                        <Route path="/topics" element={
                            <PrivateRoute role="student">
                                <ResearchTopics />
                            </PrivateRoute>
                        } />
                        <Route path="/jobs" element={
                            <PrivateRoute role="student">
                                <Jobs />
                            </PrivateRoute>
                        } />
                        <Route path="/application-form" element={
                            <PrivateRoute role="student">
                                <ApplicationForm />
                            </PrivateRoute>
                        } />
                        <Route path="/video-recorder" element={
                            <PrivateRoute role="student">
                                <VideoRecorder />
                            </PrivateRoute>
                        } />

                        {/* Recruiter Routes */}
                        <Route path="/dashboard" element={
                            <PrivateRoute role="recruiter">
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        
                        {/* Shared Success Page */}
                        <Route path="/success" element={<SuccessPage />} />
                    </Routes>
                </div>
            </div>
            <div className="text-blue-500 text-center text-3xl font-bold">
            Tailwind CSS is working!
        </div>
        </Router>
    );
}

export default App;