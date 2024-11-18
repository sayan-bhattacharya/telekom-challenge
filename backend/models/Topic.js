// models/Topic.js
import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String, required: true },
    mentor: {
        name: { type: String, required: true },
        position: { type: String, required: true },
        email: { type: String, required: true }
    },
    requirements: [{ type: String }],
    datePosted: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Topic', topicSchema);