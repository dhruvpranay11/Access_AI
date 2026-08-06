import { initDb } from './db/database.js';

async function migrate() {
    try {
        const db = await initDb();
        await db.exec('ALTER TABLE analyses ADD COLUMN user_prompt TEXT;');
        console.log('Migration successful');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('Column already exists');
        } else {
            console.error('Migration failed:', e);
        }
    }
}

migrate();
