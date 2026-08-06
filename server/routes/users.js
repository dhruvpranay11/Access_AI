import express from 'express';
import { getDb } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const db = getDb();
        const user = await db.get('SELECT id, email, accessibility_needs, preferred_language FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { accessibility_needs, preferred_language } = req.body;
        const db = getDb();

        await db.run(
            'UPDATE users SET accessibility_needs = ?, preferred_language = ? WHERE id = ?',
            [accessibility_needs, preferred_language, req.user.id]
        );

        const updatedUser = await db.get('SELECT id, email, accessibility_needs, preferred_language FROM users WHERE id = ?', [req.user.id]);
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
