import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from './models/Application.js'; // Adjust the path as needed

dotenv.config();

const deleteApplications = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Delete applications where studentName is "Sayan Bhattacharya"
        const result = await Application.deleteMany({ studentName: "Sayan Bhattacharya" });
        console.log(`${result.deletedCount} applications deleted for Sayan Bhattacharya.`);
    } catch (error) {
        console.error('Error deleting applications:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

deleteApplications();