import express from 'express';
import { login, getUserById } from '../services/authService';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
    const response = await login(req.body);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(401).json(response);
    }
});

// Get current user info
router.get('/me', authenticate, async (req: AuthRequest, res) => {
    if (!req.user) {
        return res.status(401).json({ isSuccess: false, errorText: 'Unauthorized' });
    }
    
    const response = await getUserById(req.user.userId);
    if (response.isSuccess) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

export default router;
