const fetch = require('node-fetch'); // Need to ensure node-fetch is available or use built-in fetch in Node 18+

async function testCreateLink() {
    try {
        const response = await fetch('http://localhost:3000/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: 'https://example.com/api-test' })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API Error: ${response.status} ${text}`);
        }

        const data = await response.json();
        console.log('Created Link:', data);
        return data.code;
    } catch (err) {
        console.error(err);
    }
}

testCreateLink();
