const db = require('../db');

const seed = async () => {
    try {
        console.log('Initializing database...');
        // Create table
        await db.query(`
      CREATE TABLE IF NOT EXISTS links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT UNIQUE NOT NULL,
        url TEXT NOT NULL,
        "clickCount" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "lastClickedAt" TIMESTAMP WITH TIME ZONE
      );
    `);

        await db.query(`CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);`);

        console.log('Database initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
