const db = require('../db');

async function migrate() {
    try {
        console.log('Adding last_clicked_at column if not exists...');
        await db.query(`
            ALTER TABLE links 
            ADD COLUMN IF NOT EXISTS last_clicked_at TIMESTAMP WITH TIME ZONE;
        `);
        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit();
    }
}

migrate();
