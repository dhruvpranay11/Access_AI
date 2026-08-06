import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDb } from './db/database.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import historyRoutes from './routes/history.js';
import aiRoutes from './routes/ai.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

initDb().then(() => {
    console.log('SQLite database initialized.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database', err);
});
