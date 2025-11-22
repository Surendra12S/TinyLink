const express = require('express');
const path = require('path');
const routes = require('./routes');
require('dotenv').config();
const db = require('./db');

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await db.query('SELECT NOW()');
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        console.error('Please check your DATABASE_URL in .env');
    }
});
