const db = require('../db');
const { isValidUrl, validateCode } = require('../utils/validation');
const { generateCode } = require('../utils/generator');

const createLink = async (url, customCode) => {
    if (!isValidUrl(url)) {
        throw new Error('Invalid URL. Please include http:// or https://');
    }

    let code = customCode;
    if (!code) {
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 10) {
            code = generateCode();
            const existing = await db.query('SELECT 1 FROM links WHERE short_code = $1', [code]);
            if (existing.rows.length === 0) {
                isUnique = true;
            }
            attempts++;
        }
        if (!isUnique) throw new Error('Failed to generate unique code');
    } else {
        if (!validateCode(code)) {
            throw new Error('Code must be 6-8 alphanumeric characters');
        }

        const existing = await db.query('SELECT 1 FROM links WHERE short_code = $1', [code]);
        if (existing.rows.length > 0) {
            const error = new Error('Code already exists');
            error.code = 'CONFLICT';
            throw error;
        }
    }

    const result = await db.query(
        'INSERT INTO links (short_code, original_url) VALUES ($1, $2) RETURNING *',
        [code, url]
    );
    return result.rows[0];
};

const getLinkByCode = async (code) => {
    const result = await db.query('SELECT * FROM links WHERE short_code = $1', [code]);
    return result.rows[0];
};

const incrementClick = async (code) => {
    await db.query(
        'UPDATE links SET clicks = clicks + 1, last_clicked_at = NOW() WHERE short_code = $1',
        [code]
    );
};

const getAllLinks = async () => {
    const result = await db.query('SELECT * FROM links ORDER BY created_at DESC');
    return result.rows;
};

const deleteLink = async (code) => {
    await db.query('DELETE FROM links WHERE short_code = $1', [code]);
};

module.exports = {
    createLink,
    getLinkByCode,
    incrementClick,
    getAllLinks,
    deleteLink
};
