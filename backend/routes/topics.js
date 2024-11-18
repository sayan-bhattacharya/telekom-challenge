// routes/topics.js
import express from 'express';
import Topic from '../models/Topic.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const topics = await Topic.find();
        res.status(200).json(topics);
    } catch (error) {
        console.error("Error fetching topics:", error);
        res.status(500).json({ message: "Failed to fetch topics." });
    }
});

export default router;