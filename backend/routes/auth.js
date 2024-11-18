// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import tokenVerification from '../middleware/tokenVerification.js';

const router = express.Router();

// Utility function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1w' }
    );
};

// Combined handler for both registration and login
const handleAuth = async (req, res, isRegister = false) => {

    const { name, email, password, role } = req.body;

    try {
        if (isRegister) {
            // Registration flow
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword, role });
            const token = generateToken(newUser);

            return res.status(201).json({existingUser, token, message: 'User registered successfully' });
        } else {
            
            // Login flow
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = generateToken(user);
            return res.status(200).json({ token,user, message: 'User logged in successfully' });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Error with authentication process' });
    }
};

// Registration route
router.post('/register', (req, res) => handleAuth(req, res, true));

// Login route
router.post('/login', (req, res) => handleAuth(req, res));

// Protected route to fetch authenticated user details
router.get('/user', tokenVerification, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Failed to fetch user details" });
    }
});

export default router;