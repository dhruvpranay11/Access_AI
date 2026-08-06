import express from 'express';
import { getDb } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const db = getDb();
        const history = await db.all('SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { original_content, adapted_content, type } = req.body;
        const db = getDb();

        const result = await db.run(
            'INSERT INTO history (user_id, original_content, adapted_content, type) VALUES (?, ?, ?, ?)',
            [req.user.id, original_content, adapted_content, type || 'general']
        );

        const newRecord = await db.get('SELECT * FROM history WHERE id = ?', [result.lastID]);
        res.status(201).json(newRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const db = getDb();
        await db.run('DELETE FROM history WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
