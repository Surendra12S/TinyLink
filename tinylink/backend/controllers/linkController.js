const linkService = require('../services/linkService');

const toResponse = (link) => ({
    code: link.short_code,
    url: link.original_url,
    clicks: link.clicks,
    lastClickedAt: link.last_clicked_at,
    createdAt: link.created_at
});

const createLink = async (req, res, next) => {
    try {
        const { url, code } = req.body;
        const link = await linkService.createLink(url, code);
        res.status(201).json(toResponse(link));
    } catch (error) {
        next(error);
    }
};

const getLinks = async (req, res) => {
    try {
        const links = await linkService.getAllLinks();
        res.json(links.map(toResponse));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getLinkStats = async (req, res) => {
    try {
        const { code } = req.params;
        const link = await linkService.getLinkByCode(code);
        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }
        res.json(toResponse(link));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteLink = async (req, res) => {
    try {
        const { code } = req.params;
        await linkService.deleteLink(code);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const redirectLink = async (req, res) => {
    try {
        const { code } = req.params;
        const link = await linkService.getLinkByCode(code);
        if (!link) {
            return res.status(404).send('Not Found');
        }
        await linkService.incrementClick(code);
        res.redirect(link.original_url);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    createLink,
    getLinks,
    getLinkStats,
    deleteLink,
    redirectLink
};
