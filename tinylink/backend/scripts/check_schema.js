const db = require('../db');

async function checkSchema() {
    try {
        console.log('Checking tables...');
        const tables = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `);
        console.log('Tables:', tables.rows.map(r => r.table_name));

        console.log('Checking columns for "links"...');
        const res = await db.query(`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'links';
        `);
        console.log('Columns:', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error querying schema:', err);
    } finally {
        process.exit();
    }
}

checkSchema();
