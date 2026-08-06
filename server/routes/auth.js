import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getDb } from '../db/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'access_ai_super_secret_key';

const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = authSchema.parse(req.body);
        const db = getDb();

        const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existing) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        const token = jwt.sign({ id: result.lastID, email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: result.lastID, email } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = authSchema.parse(req.body);
        const db = getDb();

        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email, accessibility_needs: user.accessibility_needs, preferred_language: user.preferred_language } });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
