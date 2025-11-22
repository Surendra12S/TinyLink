const http = require('http');

const postData = JSON.stringify({
    url: 'https://example.com',
    code: 't' + Math.floor(Math.random() * 100000) // 6 chars roughly
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/links',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
    }
};

console.log('1. Creating link...');
const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode === 201) {
            const link = JSON.parse(data);
            console.log('Link created:', link);
            verifyClick(link.code);
        } else {
            console.error('Failed to create link:', res.statusCode, data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();

function verifyClick(code) {
    console.log('2. Clicking link...');
    http.get(`http://localhost:3000/${code}`, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400) {
            console.log('Redirect successful!');
            verifyStats(code);
        } else {
            console.error('Redirect failed:', res.statusCode);
        }
    }).on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });
}

function verifyStats(code) {
    console.log('3. Verifying stats...');
    http.get(`http://localhost:3000/api/links/${code}`, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            const stats = JSON.parse(data);
            console.log('Stats:', stats);
            if (stats.clicks > 0 && stats.lastClickedAt) {
                console.log('SUCCESS: Fix verified!');
            } else {
                console.error('FAILURE: Stats not updated.');
            }
        });
    });
}
