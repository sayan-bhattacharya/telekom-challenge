// routes/protected.js
import express from 'express';
import tokenVerification from '../middleware/tokenVerification.js';

const router = express.Router();

// Protected route example
router.get('/protected', tokenVerification, (req, res) => {
    res.send('This is a protected route');
});

export default router;