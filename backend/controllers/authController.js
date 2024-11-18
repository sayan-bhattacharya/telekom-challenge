// controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1w" }
    );
};

// Register Controller
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate role
        if (!["student", "recruiter"].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, role });

        // Generate JWT token
        const token = generateToken(newUser);

        // Send response with user details and token
        res.status(201).json({
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
            token,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error("Registration error:", error);
        next(error);
    }
};

// Login Controller
const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        // Validate required fields
        if (!email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user by email and role
        const user = await User.findOne({ email, role }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Send response with user details and token
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
            message: "User logged in successfully",
        });
    } catch (error) {
        console.error("Login error:", error);
        next(error);
    }
};

// Get User Controller
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        next(error);
    }
};

export { register, login, getUser };