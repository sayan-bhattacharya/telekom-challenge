// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
const isAuthenticated = !!localStorage.getItem('token');
const role = localStorage.getItem('role');
const navigate = useNavigate();
const location = useLocation();

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
    window.location.reload(); // Ensures the app reloads without cached data
};

// Show logout button only if authenticated and not on the login or signup page
const showLogoutButton = isAuthenticated && !['/login', '/signup'].includes(location.pathname);

return (
    <nav className="navbar bg-white shadow-md">
        <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-20">
                {/* Logo Section */}
                <Link to="/" className="logo flex items-center space-x-2">
                    <span className="logo-icon text-3xl font-bold text-telekom-magenta">DT</span>
                    <span className="logo-text text-xl font-semibold text-telekom-gray-800">Student Platform</span>
                </Link>

                {/* Links Section */}
                <div className="flex space-x-6 items-center">
                    {isAuthenticated && (
                        <>
                            {role === 'student' && (
                                <>
                                    <Link to="/topics" className="navbar-link">
                                        Research Topics
                                    </Link>
                                    <Link to="/jobs" className="navbar-link">
                                        Working Student Jobs
                                    </Link>
                                </>
                            )}
                            {role === 'recruiter' && (
                                <Link to="/dashboard" className="navbar-link">
                                    Dashboard
                                </Link>
                            )}
                        </>
                    )}

                    {/* Auth buttons */}
                    {!isAuthenticated ? (
                        <div className="space-x-4">
                            {location.pathname !== '/login' && (
                                <Link to="/login" className="navbar-button login-button">
                                    Login
                                </Link>
                            )}
                            {location.pathname !== '/signup' && (
                                <Link to="/signup" className="navbar-button signup-button">
                                    Sign Up
                                </Link>
                            )}
                        </div>
                    ) : (
                        showLogoutButton && (
                            <button onClick={handleLogout} className="navbar-button logout-button">
                                Logout
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    </nav>
);
}

export default Navbar;