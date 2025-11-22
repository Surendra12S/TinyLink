const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.code === 'CONFLICT') {
        return res.status(409).json({ error: err.message });
    }

    if (err.message.includes('Invalid URL') || err.message.includes('Code must be')) {
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
