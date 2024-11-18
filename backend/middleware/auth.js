// middleware/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log('Received signup data:', req.body);  // Log received data

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`User with email ${email} already exists.`);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully.');

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        console.log(`User ${name} created successfully.`);

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log('JWT token generated successfully.');

        // Send success response
        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error signing up. Please try again.' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    console.log('Received login data:', req.body);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.role !== role) {
            console.log(`Role mismatch: expected ${user.role} but received ${role}`);
            return res.status(400).json({ message: 'Invalid role' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid credentials for:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

export default router;