const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');

// API Routes
router.post('/api/links', linkController.createLink);
router.get('/api/links', linkController.getLinks);
router.get('/api/links/:code', linkController.getLinkStats);
router.delete('/api/links/:code', linkController.deleteLink);

// Health Check
router.get('/healthz', (req, res) => res.json({ ok: true, version: '1.0' }));

// Redirect Route - Must be last
router.get('/:code', linkController.redirectLink);

module.exports = router;
