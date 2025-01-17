// models/Application.js
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, default: "" },
    disability: { type: Boolean, default: false },
    cvURL: { type: String, default: null },
    videoURL: { type: String, default: null },
    summary: { type: String, default: null },         // Candidate summary generated by Groq
    transcription: { type: String, default: null },   // Transcription of the video
    dateSubmitted: { type: Date, default: Date.now }
});



const Application = mongoose.model('Application', applicationSchema);

export default Application;