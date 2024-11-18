// backend/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Import custom middleware and routes
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import topicRoutes from './routes/topics.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applicationRoutes.js';
import protectedRoutes from './routes/protected.js';
import uploadRoutes from './routes/upload.js';
import questionRoutes from './routes/question.js';

// Import application controller for CV upload
import { uploadCV, checkProcessingStatus, getGeneratedQuestion } from './controllers/applicationController.js';

// Import models for sample data insertion
import User from './models/User.js';
import Topic from './models/Topic.js';
import Job from './models/Job.js';
import Application from './models/Application.js';


dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection setup
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/cvs'); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Ensure the `uploads/cvs` directory exists
const uploadDir = path.join(process.cwd(), 'uploads/cvs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads/cvs directory');
}

// Sample data insertion if collections are empty
const insertSampleData = async () => {
    try {
        // Users
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const users = [
                { name: 'Alice', email: 'alice@student.com', password: await bcrypt.hash('password', 10), role: 'student' },
                { name: 'Grace', email: 'grace@recruiter.com', password: await bcrypt.hash('password', 10), role: 'recruiter' },
            ];
            await User.insertMany(users);
            console.log('Sample users added successfully');
        } else {
            console.log('Users already exist, skipping creation.');
        }

        // Topics
        const topicCount = await Topic.countDocuments();
        if (topicCount === 0) {
            const topics = [
                { title: "AI in Network Optimization", description: "Research on AI algorithms...", department: "Network Technologies", mentor: { name: "Dr. Smith", email: "dr.smith@network.com" }, requirements: ["AI", "Python"], datePosted: new Date() },
            ];
            await Topic.insertMany(topics);
            console.log('Sample topics added successfully');
        } else {
            console.log('Topics already exist, skipping creation.');
        }

        // Jobs
        const jobCount = await Job.countDocuments();
        if (jobCount === 0) {
            const jobs = [
                { title: "Backend Developer Intern", description: "Support backend development...", location: "Berlin", department: "IT Infrastructure", requirements: ["Node.js", "MongoDB"], type: "Working Student", contactPerson: { name: "Emma Johnson", email: "emma@recruiter.com" } },
            ];
            await Job.insertMany(jobs);
            console.log('Sample jobs added successfully');
        } else {
            console.log('Jobs already exist, skipping creation.');
        }

        // Applications
        const applicationCount = await Application.countDocuments();
        if (applicationCount === 0) {
            const applications = [
                { studentName: "Alice", email: "alice@example.com", videoURL: "https://sample-videos.com/video123.mp4", cvURL: "https://sample-cv.com/alice_cv.pdf", message: "Passionate about AI.", disability: false, dateSubmitted: new Date() },
            ];
            await Application.insertMany(applications);
            console.log('Sample applications added successfully');
        } else {
            console.log('Applications already exist, skipping creation.');
        }
    } catch (error) {
        console.error('Error inserting sample data:', error);
    }
};

// Route setup
app.use('/api', applicationRoutes);  // Set up application routes with the /api prefix


// Route setup
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes); // Assuming it has its own handler inside the file
app.use('/api/upload', uploadRoutes);
app.use('/api/applications/question', questionRoutes);


// Route for handling CV upload using multer
app.post('/api/applications/upload-cv', upload.single('cv'), uploadCV);
app.get('/api/applications/status/:requestId', checkProcessingStatus);
app.get('/api/applications/question/:requestId', getGeneratedQuestion);


// Static file serving for uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Custom error handling middleware
app.use(errorHandler);

// Server start function
const startServer = async () => {
    try {
        await connectDB();
        await insertSampleData();

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

startServer();