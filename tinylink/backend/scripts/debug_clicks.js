const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkLinkData() {
    try {
        // Check database
        const dbResult = await pool.query('SELECT * FROM links WHERE short_code = $1', ['zxu8AqhH']);
        console.log('Database row:');
        console.log(JSON.stringify(dbResult.rows[0], null, 2));

        // Simulate what the controller returns
        const link = dbResult.rows[0];
        if (link) {
            const response = {
                code: link.short_code,
                url: link.original_url,
                clicks: link.clicks,
                lastClickedAt: link.last_clicked_at,
                createdAt: link.created_at
            };
            console.log('\nController response:');
            console.log(JSON.stringify(response, null, 2));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkLinkData();
