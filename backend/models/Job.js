// models/Job.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    department: { type: String, required: true },
    requirements: [{ type: String }],
    type: { type: String, enum: ['Working Student', 'Internship', 'Full-Time'], required: true },
    contactPerson: {
        name: { type: String, required: true },
        email: { type: String, required: true }
    },
    datePosted: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);